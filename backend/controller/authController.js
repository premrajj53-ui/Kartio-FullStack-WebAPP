const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendVerificationOtp = async (user) => {
    const otp = generateOtp();

    user.emailVerificationOtp = otp;
    user.emailVerificationOtpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // 1. The Plain Text Fallback (Required for spam filters)
    const textMessage = `Welcome to Kartio! Your OTP for email verification is: ${otp}. This OTP expires in 10 minutes.`;
    
    // 2. The HTML Version (Makes it look professional and avoids spam triggers)
    const htmlMessage = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #7c3aed; margin: 0;">Welcome to Kartio!</h2>
            </div>
            <p style="color: #334155; font-size: 16px;">Hi ${user.name || 'there'},</p>
            <p style="color: #334155; font-size: 16px;">Here is your one-time password (OTP) to verify your email address:</p>
            
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
                <h1 style="font-size: 36px; letter-spacing: 8px; color: #0f172a; margin: 0;">${otp}</h1>
            </div>
            
            <p style="color: #64748b; font-size: 14px;">This code will expire in <strong>10 minutes</strong>. Please do not share this code with anyone.</p>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="color: #94a3b8; font-size: 12px; text-align: center;">If you didn't attempt to register an account with Kartio, you can safely ignore this email.</p>
        </div>
    `;

    // 3. Send both versions to SendGrid
    return sendEmail(
        user.email, 
        "Your Kartio Verification Code", 
        textMessage, 
        htmlMessage
    );
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            name,
            email,
            username: email,
            password: hashedPassword,
            verified: false,
        });

        const emailSent = await sendVerificationOtp(user);
        if (!emailSent) {
            return res.status(502).json({
                message: "OTP email could not be sent. Please try again in a few moments.",
            });
        }

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            verified: user.verified,
            message: "User registered successfully. Please check your email for the OTP.",
        });
    } catch (error) {
        console.error("--> FATAL ERROR IN REGISTER:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (!user.verified) {
            return res.status(403).json({ 
                message: "Please verify your email before logging in",
                notVerified: true,  // The frontend will look for this flag
                email: user.email   // Send the email so the OTP page knows who it is
            });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            verified: user.verified,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error("--> FATAL ERROR IN LOGIN:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password -emailVerificationOtp -emailVerificationOtpExpires");
        res.json(users);
    } catch (error) {
        console.error("--> FATAL ERROR IN GET USERS:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const verifyEmail = async (req, res) => {
    const email = req.body.email?.trim();
    const otp = String(req.body.otp || '').trim();

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email" });
        }

        if (user.verified) {
            return res.status(200).json({ message: "Email already verified" });
        }

        const storedOtp = String(user.emailVerificationOtp || '').trim();
        const expiresAt = user.emailVerificationOtpExpires;
        const now = Date.now();
        const otpMismatch = storedOtp !== otp;
        const expired = !expiresAt || expiresAt < now;

        if (!storedOtp || otpMismatch || expired) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        user.verified = true;
        user.emailVerificationOtp = undefined;
        user.emailVerificationOtpExpires = undefined;
        await user.save();

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            verified: user.verified,
            token: generateToken(user._id),
            message: "Email verified successfully",
        });
    } catch (error) {
        console.error("--> FATAL ERROR IN VERIFY EMAIL:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const resendVerificationOtp = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email" });
        }

        if (user.verified) {
            return res.status(400).json({ message: "Email is already verified" });
        }

        const emailSent = await sendVerificationOtp(user);
        if (!emailSent) {
            return res.status(502).json({ message: "Could not send OTP email. Please try again later." });
        }

        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("--> FATAL ERROR IN RESEND VERIFICATION OTP:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUsers,
    verifyEmail,
    resendVerificationOtp,
};