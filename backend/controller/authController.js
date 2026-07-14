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

    const message = `Welcome to Kartio! Your OTP for email verification is: ${otp}. This OTP expires in 10 minutes.`;
    return sendEmail(user.email, "Kartio email verification OTP", message);
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

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            verified: user.verified,
            message: emailSent
                ? "User registered successfully. Please check your email for the OTP."
                : "User registered successfully, but OTP email could not be sent. Please resend OTP.",
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
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email" });
        }

        if (user.verified) {
            return res.status(200).json({ message: "Email already verified" });
        }

        if (
            !user.emailVerificationOtp ||
            user.emailVerificationOtp !== otp ||
            !user.emailVerificationOtpExpires ||
            user.emailVerificationOtpExpires < Date.now()
        ) {
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
            return res.status(500).json({ message: "Could not send OTP email" });
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
