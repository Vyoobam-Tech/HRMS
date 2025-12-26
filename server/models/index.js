import { sequelize } from "../config/db.js";
import { User } from "./User.js";
import { LeaveRequest } from "./LeaveRequest.js";


LeaveRequest.belongsTo(User, {
  foreignKey: "empid",
  targetKey: "empid"
});

User.hasMany(LeaveRequest, {
  foreignKey: "empid",
  sourceKey: "empid"
});

// export models
export {
  sequelize,
  User,
  LeaveRequest
};
