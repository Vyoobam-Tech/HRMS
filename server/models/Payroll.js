import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

// 1. Master definition of Salary Heads (e.g., Basic, HRA, PF)
// This makes it fully dynamic. Admin can add "Gym Allowance" later.
export const SalaryComponent = sequelize.define("SalaryComponent", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false, // e.g., "Medical Allowance"
  },
  type: {
    type: DataTypes.ENUM("earning", "deduction"),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true, // Allows enabling/disabling without deleting
  }
});

// 2. Map specific values to an Employee
// We use a flat structure for simplicity: empId -> JSON of values
// Or strictly relational. Relational is more "MNC" query-able.
// Let's go with a simple "EmployeeSalaryStructure" that holds base details.
export const EmployeeSalary = sequelize.define("EmployeeSalary", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  empId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // One structure per employee
  },
  // We store the breakdown as JSON: { "Basic": 50000, "HRA": 20000 }
  // This allows flexibility if components change.
  structure: {
    type: DataTypes.JSONB, 
    defaultValue: {},
  },
  netSalary: {
    type: DataTypes.FLOAT, // Cached total per month (estimated)
    defaultValue: 0,
  }
});

// 3. Generated Payslips (History)
export const Payslip = sequelize.define("Payslip", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  empId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  month: {
    type: DataTypes.STRING, // "January 2026"
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalEarnings: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  totalDeductions: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  netPay: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  // Snapshot of calculations at that time (so future stricture changes don't break history)
  breakdown: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("generated", "paid"),
    defaultValue: "generated",
  }
});
