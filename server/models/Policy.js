import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Policy = sequelize.define(
    "Policy",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        file_name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },{
        tableName: "policy",
        timestamps: true
    }
)