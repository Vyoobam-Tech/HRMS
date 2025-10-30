import cron from "node-cron"
import { Attendance } from "../models/Attendance.js"
import { Employee } from "../models/Employee.js"
import { Holiday } from "../models/Holiday.js"


export const startAutoAbsent = () => {
    cron.schedule("59 23 * * *", async () => {
        try{
            const today = new Date().toISOString().split("T")[0]

            const holiday = await Holiday.findOne({
                where: {
                    date: new Date(today)
                }
            })

            if(holiday){
                return
            }

            const employees = await Employee.findAll()

            for (const emp of employees) {
                const empId = emp.empId
                const att = await Attendance.findOne({
                    where: {
                        empid: empId,
                        attendancedate: today
                    }
                })

                if(!att){
                    await Attendance.create({
                        empid: empId,
                        name: emp.name,
                        attendancedate: today,
                        login: null,
                        breakminutes: null,
                        lunchminutes: null,
                        logout: null,
                        status: "Absent",
                        totalhours: "0h 0m"
                    })
                }
            }
        }catch(err){
            console.log(err)
        }
    },{
        timezone: "Asia/Kolkata"
    })
}