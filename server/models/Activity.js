import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Activity = sequelize.define(
  "Activity",
  {
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    empid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    employeename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    taskname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startingtime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    endingtime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    complete: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    githublink: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: "activities",
    timestamps: true,
  }
);
