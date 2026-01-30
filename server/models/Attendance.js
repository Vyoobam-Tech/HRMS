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
            allowNull: true
        },
        breakminutes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        lunchminutes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
            },
        logout: {
            type: DataTypes.TIME,
        },
        totalminutes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        totalhours: {
            type: DataTypes.STRING,
        },
        overtimeminutes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        overtime: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.STRING
        }
    }, {
        tableName: 'attendance',
        timestamps: true
    }
)