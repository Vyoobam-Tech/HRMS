import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'

export const EmployeeLeaveBalance = sequelize.define(
    "EmployeeLeaveBalance",
    {
        empid: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        month: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        clTotal: {
            type: DataTypes.INTEGER,
            defaultValue: 12
        },
        slTotal: {
            type: DataTypes.INTEGER,
            defaultValue: 8
        },
        plTotal: {
            type: DataTypes.INTEGER,
            defaultValue: 8
        },
        clUsed: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        slUsed: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        plUsed : {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    },
    {
        tableName: "employee_leave_balance",
        timestamps: true
    }
)