import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Names = sequelize.define(
  "Names",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.ENUM("DEPARTMENT", "REPORT"),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "names",
    timestamps: false,
  }
);
