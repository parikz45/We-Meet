const router = require("express").Router();
const User = require("../Models/User");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const { sendMail } = require("../utils/nodemailer");

// Throttle sensitive auth endpoints to slow brute-force / email-spam attempts.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many attempts, please try again later",
});

// Sign a short-lived access token for a user document.
const generateToken = (user) =>
  jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

// ==========================
// REGISTER
// ==========================
router.post("/register", authLimiter, async (req, res) => {
  try {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = generateToken(user);
    const { password, ...other } = user._doc;
    res.status(200).json({ ...other, token });
  } catch (err) {
    // Duplicate key (unique username/email) -> tell the user which one is taken.
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || "account";
      const label = field.charAt(0).toUpperCase() + field.slice(1);
      return res.status(409).json(`${label} already exists`);
    }
    console.error("❌ Registration error:", err);
    res.status(500).json("Registration failed");
  }
});

// ==========================
// LOGIN
// ==========================
router.post("/login", authLimiter, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("User not found");

    const validPassword = await bcryptjs.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json("Wrong password");

    const token = generateToken(user);
    const { password, ...other } = user._doc;
    res.status(200).json({ ...other, token });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json("Internal Server Error");
  }
});

// ==========================
// FORGOT PASSWORD
// ==========================
router.post("/forgot-password", authLimiter, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    // IMPORTANT: don't reveal if email exists (security best practice)
    if (!user) {
      return res.status(200).json("If the email exists, a reset link was sent");
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/resetPassword/${token}`;

    await sendMail({
      to: user.email,
      subject: "Reset your password",
      html: `
        <h2>Password Reset</h2>
        <p>You requested a password reset.</p>
        <a href="${resetLink}">Click here to reset your password</a>
        <p>This link expires in 15 minutes.</p>
      `,
    });
    console.log("EMAIL:", process.env.EMAIL);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "LOADED" : "MISSING");
    res.json("Reset link sent to email");
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    res.status(500).json("Failed to send reset email");
  }
});

// ==========================
// RESET PASSWORD
// ==========================
router.post("/reset-password/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json("Invalid or expired token");

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(req.body.password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    // Optional confirmation email
    await sendMail({
      to: user.email,
      subject: "Password changed successfully",
      html: `
        <p>Your password has been updated successfully.</p>
        <p>If this wasn't you, please contact support immediately.</p>
      `,
    });

    res.json("Password updated successfully");
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json("Password reset failed");
  }
});

module.exports = router;