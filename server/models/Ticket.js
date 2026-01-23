import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Ticket = sequelize.define(
    "Ticket",
    {
        ticketId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        empId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        empName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category: {
            type: DataTypes.ENUM("Payroll", "Leave", "IT", "HR", "Other"),
            allowNull: false,
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        attachment: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        priority: {
            type: DataTypes.ENUM("Low", "Medium", "High", "Critical"),
            defaultValue: "Low",
        },
        status: {
            type: DataTypes.ENUM(
            "Open",
            "In Progress",
            "Closed"
            ),
            defaultValue: "Open",
        },
        closedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

    },
        {
            tableName: "tickets",
            timestamps: true
        }
)

export default Ticket