import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Activity = sequelize.define(
  "Activity",
  {
    actid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    employeeName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "activities",
    timestamps: false,
  }
);
