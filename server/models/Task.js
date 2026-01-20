import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";


export const Task = sequelize.define(
    "Task",
    {
        taskId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        empId: {
            type: DataTypes.STRING,
            allowNull: false
        },

        taskTitle: {
            type: DataTypes.STRING,
            allowNull: false
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        dueDate: {
            type: DataTypes.DATE,
            allowNull: false
        },

        priority: {
            type: DataTypes.ENUM("Low", "Medium", "High", "Urgent"),
            defaultValue: "Medium"
        },

        status: {
            type: DataTypes.ENUM("Pending", "In Progress", "Completed"),
            defaultValue: "Pending"
        },

        assignedBy: {
            type: DataTypes.STRING,
            allowNull: false
        }

        }, {
        tableName: "tasks",
        timestamps: true
    });

export default Task