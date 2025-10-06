import { DataTypes } from "sequelize"
import { sequelize } from "../config/db.js"

export const Attendance = sequelize.define(
    "Attendance",
    {
        empid: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
        },
        attendancedate: {
            type: DataTypes.DATEONLY,
            defaultValue: DataTypes.NOW,
        },
        login: {
            type: DataTypes.TIME,
            allowNull: false
        },
        breakminutes: {
            type: DataTypes.INTEGER,
        },
        lunchminutes: {
            type: DataTypes.INTEGER,
        },
        logout: {
            type: DataTypes.TIME,
        },
        totalhours: {
            type: DataTypes.STRING,
        },
    }, {
        tableName: 'attendance',
        timestamps: true
    }
)