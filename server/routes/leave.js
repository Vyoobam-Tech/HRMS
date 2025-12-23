import express from 'express'
import { EmployeeLeaveBalance } from '../models/EmployeeLeaveBalance.js'
import { LeaveRequest } from '../models/LeaveRequest.js'

const router = express.Router()

router.get("/:empid", async (req, res) => {
    const { empid } = req.params

    try{
        const employeeLeave = await EmployeeLeaveBalance.findOne({
            where: {empid},
            include : [
                {
                    model: LeaveRequest
                }
            ]
        })

        if (!employeeLeave) {
            employeeLeave = await EmployeeLeaveBalance.create({
            empid,
            year: new Date().getFullYear(),
            month: new Date().toLocaleString("default", { month: "short" }),
            clTotal: 12,
            clUsed: 0,
            slTotal: 8,
            slUsed: 0,
            plTotal: 8,
            plUsed: 0
        })
        }

        res.json(employeeLeave);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
})

export { router as LeaveRouter}
