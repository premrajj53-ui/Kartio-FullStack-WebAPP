const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }   ,
    verified: {
        type: Boolean,
        default: false
    },
    emailVerificationOtp: {
        type: String
    },
    emailVerificationOtpExpires: {
        type: Date
    }
});

module.exports = mongoose.model("User", userSchema);
