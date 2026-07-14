const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUsers,
    verifyEmail,
    resendVerificationOtp,
} = require("../controller/authController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddlewere");
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", protect, admin, getUsers);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification-otp", resendVerificationOtp);

module.exports = router;
