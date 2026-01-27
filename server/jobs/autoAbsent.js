import cron from "node-cron"
import { Attendance } from "../models/Attendance.js"
import { Employee } from "../models/Employee.js"
import { Holiday } from "../models/Holiday.js"
import { Op } from "sequelize";


export const startAutoAbsent = () => {
    cron.schedule("59 23 * * *", async () => {
        try{
            console.log("⏳ Running auto-absent cron job...");
            const today = new Date().toISOString().split("T")[0]

            const holiday = await Holiday.findOne({
                where: {
                    date: new Date(today)
                }
            })

            if(holiday){
                console.log("📅 Today is a holiday, skipping auto-absent.");
                return
            }

            // Find all employees who have NOT marked attendance today
            const presentEmployeeIds = await Attendance.findAll({
                attributes: ["empid"],
                where: {
                    attendancedate: today
                }
            }).then(atts => atts.map(a => a.empid));

            const absentEmployees = await Employee.findAll({
                where: {
                    empId: { [Op.notIn]: presentEmployeeIds }
                }
            });

            if (absentEmployees.length === 0) {
                console.log("✅ Everyone is present today.");
                return;
            }

            const absentRecords = absentEmployees.map(emp => ({
                empid: emp.empId,
                name: emp.name,
                attendancedate: today,
                login: null,
                breakminutes: null,
                lunchminutes: null,
                logout: null,
                status: "Absent",
                totalhours: "0h 0m"
            }));

            await Attendance.bulkCreate(absentRecords);
            console.log(`✅ Marked ${absentRecords.length} employees as Absent.`);

        }catch(err){
            console.error("❌ Auto-absent job error:", err);
        }
    },{
        timezone: "Asia/Kolkata"
    })
}