import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { Op, where } from "sequelize";


const router = express.Router();

// ---------------------- Signup Route ----------------------
router.post("/signup", async (req, res) => {
  try {
    const { role, username, empid, department, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.json({ status: false, message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    await User.create({ role, username, empid, department, email, password: hashedPassword });

    return res.status(201).json({ status: true, message: "User registered successfully" });
  } catch (err) {
    console.error("Signup error:", err.message);
    return res.status(500).json({ status: false, message: "Signup failed", error: err.message });
  }
});

// ---------------------- Login Route ----------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const emailNormalized = email.trim().toLowerCase(); // normalize email
    const user = await User.findOne({ where: { email: emailNormalized } });

    if (!user) {
      return res.status(400).json({ status: false, message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ status: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res.json({ status: true, message: "Login successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, message: "Login failed", error: err.message });
  }
});


router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const emailNormalized = email.trim().toLowerCase();
    const user = await User.findOne({
      where: { email: emailNormalized }
    });

    const successMessage = {
      message: "If this email exists, a password reset link has been sent"
    };

    if (!user) return res.json(successMessage);

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

   const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP VERIFY FAILED:", error);
  } else {
    console.log("✅ SMTP SERVER READY");
  }
});


    await transporter.sendMail({
      from: `"HRMS App" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 1 hour.</p>
      `,
    });

    res.json(successMessage);
  } catch (err) {
    console.error(err);
    res.json({
      message: "If this email exists, a password reset link has been sent"
    });
  }
});


// ---------------------- Reset Password Route ----------------------
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() }
      }
    });

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Invalid or expired token"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({
      status: true,
      message: "Password reset successful"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Reset failed" });
  }
});


// ---------------------- Middleware: Verify JWT ----------------------
const verifyUser = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ status: false, message: "No token found" });

    req.user = jwt.verify(token, process.env.KEY);
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    return res.status(401).json({ status: false, message: "Invalid token or expired" });
  }
};

// ---------------------- Check Session ----------------------
router.get("/checkSession", verifyUser, (req, res) =>
  res.json({ status: true, message: "Authorized" })
);

// ---------------------- Logout ----------------------
router.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return res.json({ status: true, message: "Logged out successfully" });
});

// ---------------------- Profile ----------------------
router.get("/profile", verifyUser, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "role", "username", "empid", "email"],
    });
    if (!user) return res.status(404).json({ status: false, message: "User not found" });

    res.json({ status: true, user });
  } catch (err) {
    console.error("Profile error:", err.message);
    return res.status(500).json({ status: false, message: "Failed to fetch profile", error: err.message });
  }
});

export { router as UserRouter };

// ---------------- Check Super Admin Exists ----------------
router.get("/has-superadmin", async (req, res) => {
  try {
    const superAdmin = await User.findOne({
      where: { role: "superadmin" }
    });

    res.json({
      hasSuperAdmin: !!superAdmin
    });
  } catch (err) {
    console.error("Super admin check error:", err);
    res.status(500).json({ hasSuperAdmin: false });
  }
});


router.get("/employees/count", async (req, res) => {
  try {
    const { department } = req.query;

    const total = await User.count({
      where: {
        department: department.toLowerCase(),
        role: "employee",
      },
    });

    res.json({ total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching count" });
  }
});

