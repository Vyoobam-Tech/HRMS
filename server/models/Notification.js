import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js"

export const Notification = sequelize.define(
    "Notification",
    {
        notificationId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title:{
            type: DataTypes.STRING,
            allowNull: false
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false
        },
        empId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        tableName: "notifications",
        timestamps: true,
    })
