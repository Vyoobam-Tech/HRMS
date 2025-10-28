import { DataTypes, INTEGER } from "sequelize";
import { sequelize } from "../config/db.js";

export const Holiday = sequelize.define(
    "Holiday",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        day: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type:DataTypes.ENUM("RH","CH"),
            allowNull: false,
        },
    },
    {
        tableName: "holiday",
        timestamps: true
    }
)