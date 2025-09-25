import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Employee = sequelize.define("Employee", {
  empid: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dob: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  contact: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  joining: {
    type: DataTypes.DATE, 
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  band: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: "employees",
  timestamps: false
});
