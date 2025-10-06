import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { User } from "../models/User.js";

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashedPassword });

    return res.json({ status: true, message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, message: "Signup failed" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.json({ message: "User is not registered" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.json({ message: "Incorrect password" });

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.KEY, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000, sameSite: "lax", secure:false });

    return res.json({ status: true, message: "Login successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, message: "Login failed" });
  }
});

// Google Login Route
router.post("/google-login", async (req, res) => {
  const { email, name, picture } = req.body;

  try {
    let user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.create({ username: name, email, picture });
    }

    return res.json({ status: true, message: "Google login successful" });
  } catch (error) {
    console.error('Google login failed:', error);
    return res.status(500).json({ status: false, message: "Internal Server Error" });
  }
});

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.json({ message: "User not registered" });

    const token = jwt.sign({ id: user.id }, process.env.KEY, { expiresIn: "5m" });
    const encodedToken = encodeURIComponent(token).replace(/\./g, "%2E");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password",
      text: `http://localhost:5173/resetPassword/${encodedToken}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.json({ message: "Error sending email" });
      }
      return res.json({ status: true, message: "Email sent" });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

// Reset Password
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.KEY);
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.update({ password: hashedPassword }, { where: { id: decoded.id } });

    return res.json({ status: true, message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ status: false, message: "Invalid or expired token" });
  }
});

// Middleware to verify token
const verifyUser = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ status: false, message: "No token found" });

    const decoded = jwt.verify(token, process.env.KEY);
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    return res.status(404).json({ status: false, message: "Invalid token" });
  }
};

// Token verification route
router.get("/checkSession", verifyUser, (req, res) => {
  return res.json({ status: true, message: "Authorized" });
});

// Logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ status: true, message: "Logged out successfully" });
});

router.get("/profile", verifyUser, async (req,res) => {
  try{
    const user = await User.findByPk(req.user.id, {
      attributes : ['id', "username", "email"]
    })
    if (!user) return res.status(404).json({ status: false, message: "user not found"})

    res.json({status: true, user})
  } catch (err) {
    console.log(err)
  }
})

export { router as UserRouter };
