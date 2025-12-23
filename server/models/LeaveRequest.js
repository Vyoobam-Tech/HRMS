import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { EmployeeLeaveBalance } from './EmployeeLeaveBalance.js';

export const LeaveRequest = sequelize.define(
    "LeaveRequest",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        empid: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: EmployeeLeaveBalance,
                key: "empid"
            }
        },
        leaveType: {
            type: DataTypes.ENUM("CL","SL","PL"),
            allowNull: false
        },
        fromDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        toDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        days: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
            defaultValue: 'Pending',
        },
        }, {
            tableName: 'leave_requests',
            timestamps: true,
})

EmployeeLeaveBalance.hasMany(LeaveRequest, {foreignKey: "empid"})
LeaveRequest.belongsTo(EmployeeLeaveBalance, {foreignKey: "empid"})