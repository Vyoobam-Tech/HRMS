import express from 'express'
import { Attendance } from '../models/Attendance.js'

const router = express.Router()

router.post("/", async (req, res) => {
    try{
        const {empid, name, attendancedate, login, breakminutes, lunchminutes, logout, totalhours} = req.body

        const attendance = await Attendance.create({
            empid,
            name,
            attendancedate,
            login,
            breakminutes,
            lunchminutes,
            logout,
            totalhours
        })
        res.status(201).json({
            success: true,
            message: "Attendance Created",
            date: attendance
        })
    } catch(err){
        res.status(500).json({ success: false, message: "Error creating attendance",err})
    }
})

export {router as AttendanceRouter}