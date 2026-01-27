import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan"; // Import morgan
import { sequelize } from "./config/db.js";
import { UserRouter } from "./routes/user.js";
import { EmployeeRouter } from "./routes/employee.js";
import { DepartmentRouter } from "./routes/department.js";
import { ActivityRouter } from "./routes/activity.js";
import { AttendanceRouter } from "./routes/attendance.js";
import { startAutoAbsent } from "./jobs/autoAbsent.js";
import { HolidayRouter } from "./routes/holiday.js";
import { LeaveRouter } from "./routes/leave.js";
import { PolicyRouter } from "./routes/policy.js";
import { NamesRouter } from "./routes/names.js";
import { EmployeeDocumentRouter } from "./routes/employeeDocument.js";
import multer from "multer";
import path from "path";
import { TaskRouter} from "./routes/task.js";
import { NotificationRouter } from "./routes/notification.js";
import { TicketRouter } from "./routes/ticket.js";
import { PayrollRouter } from "./routes/payroll.js";
import setupSecurity from "./middleware/security.js"; // Import security setup
import { limiter } from "./middleware/limiter.js"; // Import rate limiter


dotenv.config();
const app = express();

setupSecurity(app); // Apply security middleware
app.use(limiter); // Apply rate limiting

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(morgan("dev")); // Use morgan for logging

// Routes
app.use("/auth", UserRouter);
app.use("/api/employees", EmployeeRouter);
app.use("/api/departments", DepartmentRouter);
app.use("/api/activities", ActivityRouter);
app.use("/api/attendance", AttendanceRouter);
app.use("/api/holiday", HolidayRouter);
app.use("/api/leave", LeaveRouter)
app.use("/api/policy", PolicyRouter)
app.use("/api/document", EmployeeDocumentRouter)
app.use("/api/names", NamesRouter)
app.use("/api/tasks", TaskRouter)
app.use("/api/notifications", NotificationRouter)
app.use("/api/ticket", TicketRouter)
app.use("/api/payroll", PayrollRouter) // NEW Payroll Route
app.get("/", (req, res) => {
  res.send("HRMS Backend is running ✅");
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }

  if (err) {
    return res.status(400).json({ message: err.message });
  }

  next();
});


app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);




// ✅ Database connection check + sync
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Connected to Render PostgreSQL successfully");

    // Disable auto-alter in production to prevent data loss
    const syncOptions = process.env.NODE_ENV === "production" ? {} : { alter: true };
    return sequelize.sync(syncOptions);
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
      .sync({ alter: process.env.NODE_ENV !== "production" }) // Safer fallback
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