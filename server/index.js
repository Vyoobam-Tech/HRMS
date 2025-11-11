import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { sequelize } from "./config/db.js";
import { UserRouter } from "./routes/user.js";
import { EmployeeRouter } from "./routes/employee.js";
import { DepartmentRouter } from "./routes/department.js";
import { ActivityRouter } from "./routes/activity.js";
import { AttendanceRouter } from "./routes/attendance.js";
import { startAutoAbsent } from "./jobs/autoAbsent.js";
import { HolidayRouter } from "./routes/holiday.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173", "https://hrms-client1-j8mf.onrender.com"],
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true,
  })
);

app.use(cookieParser());

// Routes
app.use("/auth", UserRouter);
app.use("/api/employees", EmployeeRouter);
app.use("/api/departments", DepartmentRouter);
app.use("/api/activities", ActivityRouter);
app.use("/api/attendance", AttendanceRouter);
app.use("/api/holiday", HolidayRouter);

// ✅ Database connection check + sync
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Connected to Render PostgreSQL successfully");

    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("✅ Database sync complete");
    startAutoAbsent();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed, using old config:", err);

    // 🟡 Fallback to old code
    sequelize
      .sync({ alter: true })
      .then(() => {
        console.log("DB connected (old)");
        startAutoAbsent();
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
          console.log(`Server running on port ${PORT}`);
        });
      })
      .catch((err2) => {
        console.error("DB connection error (old):", err2);
      });
  });
