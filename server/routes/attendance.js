import express from 'express'
import { Attendance } from '../models/Attendance.js'

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

export {router as AttendanceRouter}