import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Department = sequelize.define(
  "Department",
  {
    depid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // code: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // branch: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    hod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // reporting: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // budget: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
    created: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "departments",
    timestamps: false,
  }
);
