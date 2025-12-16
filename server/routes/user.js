// import express from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { User } from "../models/User.js";

// const router = express.Router();

// // Signup Route (no email)
// router.post("/signup", async (req, res) => {
//   try {
//     const { role, username, empid, email, password } = req.body;

//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser) return res.json({ status: false, message: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await User.create({ role, username, empid, email, password: hashedPassword });

//     return res.status(201).json({ status: true, message: "User registered successfully" });
//   } catch (err) {
//     console.error("Signup error:", err.message);
//     return res.status(500).json({ status: false, message: "Signup failed", error: err.message });
//   }
// });

// // Login Route
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ where: { email } });
//     if (!user) return res.json({ message: "User is not registered" });

//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword) return res.json({ message: "Incorrect password" });

//     const token = jwt.sign({ id: user.id, username: user.username }, process.env.KEY, { expiresIn: "1h" });
//     res.cookie("token", token, {
//     httpOnly: true,
//     maxAge: 3600000, // 1 hour
//     sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // none for prod
//     secure: process.env.NODE_ENV === "production", // must be HTTPS in prod
// });


//     return res.json({ status: true, message: "Login successful" });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ status: false, message: "Login failed" });
//   }
// });

// // Reset Password Route (optional: just update password directly)
// router.post("/reset-password", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ where: { email } });
//     if (!user) return res.json({ message: "User not registered" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     await User.update({ password: hashedPassword }, { where: { id: user.id } });

//     return res.json({ status: true, message: "Password updated successfully" });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ status: false, message: "Password reset failed" });
//   }
// });

// // Middleware & routes for session, logout, profile
// const verifyUser = (req, res, next) => {
//   try {
//     const token = req.cookies.token;
//     if (!token) return res.status(401).json({ status: false, message: "No token found" });
//     req.user = jwt.verify(token, process.env.KEY);
//     next();
//   } catch (err) {
//     console.error(err);
//     return res.status(401).json({ status: false, message: "Invalid token or expired " });
//   }
// };

// router.get("/checkSession", verifyUser, (req, res) => res.json({ status: true, message: "Authorized" }));
// router.get("/logout", (req, res) => { 
//   res.clearCookie("token", {
//   httpOnly: true,
//   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//   secure: process.env.NODE_ENV === "production",
// })
//  return res.json({ status: true, message: "Logged out successfully" }); });
// router.get("/profile", verifyUser, async (req, res) => {
//   try {
//     const user = await User.findByPk(req.user.id, { attributes: ["id", "role", "username", "empid", "email"] });
//     if (!user) return res.status(404).json({ status: false, message: "User not found" });
//     res.json({ status: true, user });
//   } catch (err) {
//     console.error(err);
//   }
// });

// export { router as UserRouter };


import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const router = express.Router();

// ---------------------- Signup Route ----------------------
router.post("/signup", async (req, res) => {
  try {
    const { role, username, empid, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.json({ status: false, message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    await User.create({ role, username, empid, email, password: hashedPassword });

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


router.post("/forgot-password",async (req,res) => {
  try{
    const {email}=req.body
    if(!email){
      return res.status(400).json({error:"Email Required"})
    }
    const emailNormalized=email.trim().toLowerCase()
    const user = await User.findOne({email:emailNormalized})
    const successMessage={
      message:"If this email exists, a password reset link has been sent"
    }
    if(!user){
      return res.json(successMessage)
    }
    const token=crypto.randomBytes(32).toString("hex")
    user.resetPasswordToken=token
    user.resetPasswordExpires=Date.now() + 3600000
    await user.save()

    const resetLink = `${process.env.VITE_API_BASE_URL}/reset-password/${token}`
    const mailOptions ={
      from: `"HRMS App" <${process.env.EMAIL_USER}>`,
      to:user.email,
      subject:"Password Reset Request",
      html:`
       <p>You requested a password reset. Click the link below:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 1 hour.</p>
      `,
    }
    let transporter
    try{
      transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
          user:process.env.EMAIL_USER,
          pass:process.env.EMAIL_PASS,
        },
      })
      transporter.verify((err,success)=>{
        if(err){
          console.log("SMTP ERROR:",err)
        }
        else{
          console.log("SMTP OK:",success)
        }
      })
    }catch(err){
      console.log("Transport creation error:",err.message)
    }
  }
})

// ---------------------- Reset Password Route ----------------------
router.post("/reset-password", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.json({ status: false, message: "User not registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.update({ password: hashedPassword }, { where: { id: user.id } });

    return res.json({ status: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Reset password error:", err.message);
    return res.status(500).json({ status: false, message: "Password reset failed", error: err.message });
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
