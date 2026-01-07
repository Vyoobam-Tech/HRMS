import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Employee = sequelize.define(
  "Employee",
  {
    empId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    personalEmail: {
      type: DataTypes.STRING,
      unique: true
    },
    contact: {
      type: DataTypes.STRING
    },
    fatherName: {
      type: DataTypes.STRING
    },
    motherName: {
      type: DataTypes.STRING
    },
    occupation: {
      type: DataTypes.STRING
    },
    faormoNumber: {
      type: DataTypes.STRING
    },
    permanentAddress: {
      type: DataTypes.TEXT
    },
    communicationAddress: {
      type: DataTypes.TEXT
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    bloodGroup: {
      type: DataTypes.STRING
    },
    maritalStatus: {
      type: DataTypes.STRING
    },
    spouseName: {
      type: DataTypes.STRING
    },
    spouseContact: {
      type: DataTypes.STRING
    },
    aadhaar: {
      type: DataTypes.STRING,
      unique: true
    },
    pan: {
      type: DataTypes.STRING,
      unique: true
    },
    tenthBoard: {
      type: DataTypes.STRING
    },
    tenthYearofPassing: {
      type: DataTypes.STRING
    },
    tenthPercentage: {
      type: DataTypes.STRING
    },
    twelveBoard: {
      type: DataTypes.STRING
    },
    twelveYearofPassing: {
      type: DataTypes.STRING
    },
    twelvePercentage: {
      type: DataTypes.STRING
    },
    ugUniversity: {
      type: DataTypes.STRING
    },
    ugYearofPassing: {
      type: DataTypes.STRING
    },
    ugPercentage: {
      type: DataTypes.STRING
    },
    pgUniversity: {
      type: DataTypes.STRING
    },
    pgYearofPassing: {
      type: DataTypes.STRING
    },
    pgPercentage: {
      type: DataTypes.STRING
    },
    hasExperience: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    experiences: {
      type: DataTypes.JSONB
    },
    bankName: {
      type: DataTypes.STRING
    },
    accountNumber: {
      type: DataTypes.STRING
    },
    ifscCode: {
      type: DataTypes.STRING
    },
    branch: {
      type: DataTypes.STRING
    },
  },
  {
    tableName: "employees",
    timestamps: false,
  }
)


