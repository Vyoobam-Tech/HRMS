import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const EmployeeDocument = sequelize.define(
  "EmployeeDocument",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    empid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    aadhar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    license: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "employee_documents",
    timestamps: true,
  }
);
