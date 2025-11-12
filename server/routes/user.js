// import express from "express";
// import bcrypt from 'bcryptjs'
// import jwt from "jsonwebtoken";
// import { User } from "../models/User.js";
// import { Resend } from "resend";

// const router = express.Router();

// const resend = new Resend(process.env.RESEND_API_KEY)



// router.post("/signup", async (req, res) => {
//   try {
//     const { role, username, empid, email } = req.body;

//     // Check if the user already exists
//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser) {
//       return res.json({ status: false, message: "User already exists" });
//     }

//     // Generate random password
//     const password = Math.random().toString(36).slice(-8);
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create the user
//     await User.create({
//       role,
//       username,
//       empid,
//       email,
//       password: hashedPassword,
//     });

//     // ✅ Send email using Resend (no Gmail, no timeout)
//     try {
//       await resend.emails.send({
//         from: "Vyoobam HR <onboarding@resend.dev>", // use verified domain
//         to: email,
//         subject: "Your HRMS Account Details",
//         text: `Hi ${username},

// Your HRMS account has been successfully created!

// Login credentials:
// Email: ${email}
// Password: ${password}

// Please log in and change your password after first login.

// Best regards,
// Vyoobam HR Team`,
//       });

//       console.log(`✅ Email sent successfully to ${email}`);
//     } catch (emailError) {
//       console.warn("⚠️ Email sending failed:", emailError.message);
//     }

//     return res.status(201).json({
//       status: true,
//       message: "User registered successfully and email sent",
//     });
//   } catch (err) {
//     console.error("❌ Signup error:", err.message);
//     return res
//       .status(500)
//       .json({ status: false, message: "Signup failed", error: err.message });
//   }
// });


// // router.post("/signup", async (req, res) => {
// //   try{
// //     const {role, username, empid, email} = req.body

// //     const existingUser = await User.findOne({ where: {email}})
// //     if(existingUser){
// //       return res.json({ message: "User already exists"})
// //     }

// //     const password = Math.random().toString(36).slice(-8)
// //     const hashedPassword = await bcrypt.hash(password, 10)

// //     await User.create({
// //       role,
// //       username,
// //       empid,
// //       email,
// //       password: hashedPassword
// //     })

// //     const transporter = nodemailer.createTransport({
// //       service: "gmail",
// //       auth: {
// //         user: process.env.EMAIL_USER,
// //         pass: process.env.EMAIL_PASS
// //       }
// //     })

// //     await transporter.sendMail({
// //       from: `"Vyoobam HR" <${process.env.EMAIL_USER}>`,
// //       to: email,
// //       subject: "Your Employee Account Password",
// //       text: `Hi ${username},\n\nYour account has been created.\n\nLogin with:\nEmail: ${email}\nPassword: ${password}\n\nPlease change your password after login.`,
// //     })
// //     return res.json({status: true, message: "User registered successfully"})
// //   }catch(err){
// //     console.log(err)
// //     return res.status(500).json({status: false, message: "signup failed"})
// //   }
// // })



// // Login Route
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ where: { email } });
//     if (!user) return res.json({ message: "User is not registered" });

//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword) return res.json({ message: "Incorrect password" });

//     const token = jwt.sign({ id: user.id, username: user.username }, process.env.KEY, { expiresIn: "1h" });
//     res.cookie("token", token, { httpOnly: true, maxAge: 3600000, sameSite: "lax", secure: process.env.NODE_ENV === "production" ? true : false });

//     return res.json({ status: true, message: "Login successful" });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ status: false, message: "Login failed" });
//   }
// });

// // Google Login Route
// router.post("/google-login", async (req, res) => {
//   const { email, name, picture } = req.body;

//   try {
//     let user = await User.findOne({ where: { email } });
//     if (!user) {
//       user = await User.create({ username: name, email, picture });
//     }

//     return res.json({ status: true, message: "Google login successful" });
//   } catch (error) {
//     console.error('Google login failed:', error);
//     return res.status(500).json({ status: false, message: "Internal Server Error" });
//   }
// });

// // Forgot Password
// // router.post("/forgot-password", async (req, res) => {
// //   const { email } = req.body;
// //   try {
// //     const user = await User.findOne({ where: { email } });
// //     if (!user) return res.json({ message: "User not registered" });

// //     const token = jwt.sign({ id: user.id }, process.env.KEY, { expiresIn: "5m" });
// //     const encodedToken = encodeURIComponent(token).replace(/\./g, "%2E");

// //     const transporter = nodemailer.createTransport({
// //       service: "gmail",
// //       auth: {
// //         user: process.env.EMAIL_USER,
// //         pass: process.env.EMAIL_PASS,
// //       },
// //     });

// //     const mailOptions = {
// //       from: process.env.EMAIL_USER,
// //       to: email,
// //       subject: "Reset Password",
// //       text: `http://localhost:5173/resetPassword/${encodedToken}`,
// //     };

// //     transporter.sendMail(mailOptions, (error, info) => {
// //       if (error) {
// //         console.error(error);
// //         return res.json({ message: "Error sending email" });
// //       }
// //       return res.json({ status: true, message: "Email sent" });
// //     });
// //   } catch (err) {
// //     console.error(err);
// //     return res.status(500).json({ message: "Something went wrong" });
// //   }
// // });

// router.post("/forgot-password", async (req, res) => {
//   const { email } = req.body;
//   try {
//     const user = await User.findOne({ where: { email } });
//     if (!user) return res.json({ message: "User not registered" });

//     const token = jwt.sign({ id: user.id }, process.env.KEY, { expiresIn: "5m" });
//     const resetLink = `https://vyoobam-hrms.onrender.com/resetPassword/${encodeURIComponent(token)}`;

//     try {
//       await resend.emails.send({
//         from: "Vyoobam HR <onboarding@resend.dev>",
//         to: email,
//         subject: "Reset your HRMS password",
//         text: `Hi ${user.username},

// You requested to reset your HRMS password.
// Click the link below to set a new one (valid for 5 minutes):

// ${resetLink}

// If you didn’t request this, ignore this message.

// – Vyoobam HR Team`,
//       });

//       console.log(`✅ Password reset email sent to ${email}`);
//       return res.json({ status: true, message: "Reset link sent to email" });
//     } catch (emailError) {
//       console.error("⚠️ Email sending failed:", emailError.message);
//       return res.json({ status: false, message: "Email sending failed" });
//     }
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Something went wrong" });
//   }
// });


// // Reset Password
// router.post("/reset-password/:token", async (req, res) => {
//   const { token } = req.params;
//   const { password } = req.body;
//   try {
//     const decoded = jwt.verify(token, process.env.KEY);
//     const hashedPassword = await bcrypt.hash(password, 10);
//     await User.update({ password: hashedPassword }, { where: { id: decoded.id } });

//     return res.json({ status: true, message: "Password updated successfully" });
//   } catch (err) {
//     console.error(err);
//     return res.status(400).json({ status: false, message: "Invalid or expired token" });
//   }
// });

// // Middleware to verify token
// const verifyUser = (req, res, next) => {
//   try {
//     const token = req.cookies.token;
//     if (!token) return res.status(401).json({ status: false, message: "No token found" });

//     const decoded = jwt.verify(token, process.env.KEY);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     console.error(err);
//     return res.status(404).json({ status: false, message: "Invalid token" });
//   }
// };

// // Token verification route
// router.get("/checkSession", verifyUser, (req, res) => {
//   return res.json({ status: true, message: "Authorized" });
// });

// // Logout
// router.get("/logout", (req, res) => {
//   res.clearCookie("token");
//   return res.json({ status: true, message: "Logged out successfully" });
// });

// router.get("/profile", verifyUser, async (req,res) => {
//   try{
//     const user = await User.findByPk(req.user.id, {
//       attributes : ['id',"role", "username", "empid", "email"]
//     })
//     if (!user) return res.status(404).json({ status: false, message: "user not found"})

//     res.json({status: true, user})
//   } catch (err) {
//     console.log(err)
//   }
// })

// export { router as UserRouter };



import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { User } from "../models/User.js";

const router = express.Router();

// Setup Brevo SMTP transporter
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // TLS is used if false with port 587
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

// ------------------ SIGNUP ------------------
router.post("/signup", async (req, res) => {
  try {
    const { role, username, empid, email } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.json({ status: false, message: "User already exists" });
    }

    // Generate random password
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await User.create({ role, username, empid, email, password: hashedPassword });

    // Send email
    const mailOptions = {
      from: `"Vyoobam HR" <${process.env.BREVO_USER}>`,
      to: email,
      subject: "Your HRMS Account Details",
      text: `Hi ${username},

Your HRMS account has been successfully created!

Login credentials:
Email: ${email}
Password: ${password}

Please log in and change your password after first login.

Best regards,
Vyoobam HR Team`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${email}`);

    return res.status(201).json({ status: true, message: "User registered successfully and email sent" });
  } catch (err) {
    console.error("❌ Signup error:", err.message);
    return res.status(500).json({ status: false, message: "Signup failed", error: err.message });
  }
});

// ------------------ LOGIN ------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.json({ status: false, message: "User is not registered" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.json({ status: false, message: "Incorrect password" });

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.KEY, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000, sameSite: "lax", secure: process.env.NODE_ENV === "production" });

    return res.json({ status: true, message: "Login successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, message: "Login failed" });
  }
});

// ------------------ FORGOT PASSWORD ------------------
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.json({ status: false, message: "User not registered" });

    const token = jwt.sign({ id: user.id }, process.env.KEY, { expiresIn: "5m" });
    const resetLink = `https://vyoobam-hrms.onrender.com/resetPassword/${encodeURIComponent(token)}`;

    const mailOptions = {
      from: `"Vyoobam HR" <${process.env.BREVO_USER}>`,
      to: email,
      subject: "Reset your HRMS password",
      text: `Hi ${user.username},

You requested to reset your HRMS password.
Click the link below to set a new one (valid for 5 minutes):

${resetLink}

If you didn’t request this, ignore this message.

– Vyoobam HR Team`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}`);
    return res.json({ status: true, message: "Reset link sent to email" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, message: "Something went wrong" });
  }
});

// ------------------ RESET PASSWORD ------------------
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

export { router as UserRouter };
