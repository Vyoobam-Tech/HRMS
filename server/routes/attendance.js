import express from 'express'
import { Attendance } from '../models/Attendance.js'
import { Holiday } from "../models/Holiday.js"
import { Op } from "sequelize";

const router = express.Router()

router.post("/", async (req, res) => {
    try{
        const {empid, name, attendancedate, login, breakminutes, lunchminutes, logout, totalminutes, totalhours, status} = req.body

        const attendance = await Attendance.create({
            empid,
            name,
            attendancedate,
            login,
            breakminutes,
            lunchminutes,
            logout,
            totalminutes,
            totalhours,
            status
        })
        res.status(201).json({
            success: true,
            message: "Attendance Created",
            data: attendance
        })
    } catch(err){
        res.status(500).json({ success: false, message: "Error creating attendance",err})
    }
})

router.get("/all", async (req, res) => {
    try{
        const employeeAttendance = await Attendance.findAll()
        return res.json({status: true, data: employeeAttendance})
    } catch(err) {
        console.log(err)
        res.status(500).json({status: false, message: "Failed to fetch Attendance"})
    }
})

router.put("/:id", async (req, res) => {
    try{
        const {id} = req.params
        const {login, breakminutes, lunchminutes, logout, totalminutes, totalhours, status} = req.body

        const attendance = await Attendance.findByPk(id)
        if (!attendance) {
            return res.status(404).json({success: false, message: "Attendance not found"})
        }

        attendance.login = login
        attendance.breakminutes = breakminutes
        attendance.lunchminutes = lunchminutes
        attendance.logout = logout
        attendance.totalminutes = totalminutes
        attendance.totalhours = totalhours
        attendance.status = status

        await attendance.save()

        res.status(200).json({success: true, message: "attendance updated successfully", data: attendance})
    } catch (err) {
        res.status(500).json({ success: false, message:"error updating attendance", err})
    }
})

router.get("/by-user/:empid", async (req, res) => {
    try{
        const attendance = await Attendance.findAll({
            where:{empid: req.params.empid}
        })

        return res.json({status: true, data: attendance})
    }catch(err){
        return res.status(500).json({status: false, message: err.message})
    }
})


router.get("/summary", async (req, res) => {
    try{
        const { empid, month, year } = req.query

        const startDate = new Date(year, month - 1, 1)
        const endDate = new Date(year, month, 0)

        const attendance = await Attendance.findAll({
            where: {
                empid,
                attendancedate: {
                    [Op.between]: [startDate, endDate]
                }
            }
        })

        const holiday = await Holiday.findAll({
            where: {
                date: {
                    [Op.between]: [startDate, endDate]
                }
            }
        })

        const present = attendance.filter((a) => a.status === "Present").length
        // const absent = attendance.filter((a) => a.status === "Absent").length
        const halfday = attendance.filter((a) => a.status === "Half-day").length

        const holidayDates = holiday.map(h => new Date(h.date).toDateString())

        let workingDays = 0
        for (let day=1; day<=endDate.getDate(); day++){
            const date = new Date(year, month - 1, day)
            if(!holidayDates.includes(date.toDateString())){
                workingDays++
            }
        }

        const presentHalfday = present + halfday * 0.5

        const absent = Math.round((workingDays - presentHalfday) * 10) /10

        res.json({
            empid,
            period: `${month}/${year}`,
            workingDays,
            present,
            halfday,
            absent,
            total: present + (halfday * 0.5)
        })


    }catch(err){
        res.status(500).json({message: "Error checking data"})
    }
})


export {router as AttendanceRouter}