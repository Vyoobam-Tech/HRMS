import { body, validationResult } from "express-validator";

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, message: "Validation Error", errors: errors.array() });
  }
  next();
};

export const registerValidation = [
  body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  body("username").notEmpty().withMessage("Username is required").trim().escape(),
  body("empid").notEmpty().withMessage("Employee ID is required").trim().escape(),
  body("role").isIn(["admin", "employee", "superadmin"]).withMessage("Invalid role"),
  body("department").notEmpty().withMessage("Department is required").trim().escape(),
  validate,
];

export const loginValidation = [
  body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

export const employeeImportValidation = [
  body().isArray().withMessage("Request body must be an array of employees"),
  body("*.email").isEmail().withMessage("All employees must have a valid email"),
  body("*.empId").notEmpty().withMessage("All employees must have an Employee ID"),
  body("*.name").notEmpty().withMessage("All employees must have a Name"),
  validate,
];
