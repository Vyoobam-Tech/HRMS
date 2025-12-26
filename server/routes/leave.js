import express from 'express'
import { EmployeeLeaveBalance } from '../models/EmployeeLeaveBalance.js'
import { LeaveRequest } from '../models/LeaveRequest.js'
import { Op } from 'sequelize'
import {  User } from "../models/index.js";
import "../models/index.js"

const router = express.Router()

router.get("/all", async (req, res) => {
    try{
        const leaves = await LeaveRequest.findAll({
            include: [
                {
                model: User,
                attributes: ["username", "empid"]
                }
            ],
            order: [["createdAt", "DESC"]]
        })

        res.json(leaves)
    }catch(err){
        res.status(500).json({message: "server error"})
    }
})

router.get("/:empid", async (req, res) => {
    const { empid } = req.params

    try{

        const year = new Date().getFullYear()
        const month =new Date().getMonth() + 1
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
            month: new Date().getMonth()+1,
            clTotal: 12,
            clUsed: 0,
            slTotal: 8,
            slUsed: 0,
            plTotal: 8,
            plUsed: 0
        })
        }

        const earnedCLTotal = month

        const clRequests= await LeaveRequest.findAll({
            where: {
                empid,
                leaveType: "CL",
                status: { [Op.in]: ["Pending", "Approved"] },
                fromDate: { [Op.between]: [new Date(year,0,1), new Date(year,month,0)] }
            }
        })

        const usedCL = clRequests.reduce((total, req) => {
            const from = new Date(req.fromDate);
            const to = new Date(req.toDate);
            const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
            return total + days;
        }, 0);

        const availableCL = earnedCLTotal - usedCL
        const availableSL = employeeLeave.slTotal - employeeLeave.slUsed
        const availablePL = employeeLeave.plTotal - employeeLeave.plUsed

        res.json({
            ...employeeLeave.toJSON(),
            month,
            earnedCL: earnedCLTotal,
            availableCL: availableCL < 0 ? 0 : availableCL,
            availableSL: availableSL < 0 ? 0 : availableSL,
            availablePL: availablePL < 0 ? 0 : availablePL,
            })
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
})

router.post('/apply', async(req, res) => {
    try{
        const {empid, leaveType, fromDate, toDate} = req.body

        if(!empid || !leaveType || !fromDate || !toDate){
            return res.status(400).json({message: "All fields are required"})
        }

        const from = new Date(fromDate)
        const to = new Date(toDate)

        if(from > to ){
            return res.status(400).json({message: "From date cannot be after To date"})
        }

        const days = Math.ceil((to- from)/(1000*60*60*24))+1

        const month = new Date().getMonth()+1
        const year = new Date().getFullYear()


        const balance = await EmployeeLeaveBalance.findOne({
            where: {empid, year}
        })

        if(!balance){
            return res.status(400).json({message: "Leave balance not available"})
        }

        if(leaveType === "CL"){
    // Total CL earned till current month
            const earnedCLTotal = month;

            // Total CL used in the year
            const clRequests = await LeaveRequest.findAll({
                where: {
                    empid,
                    leaveType: "CL",
                    status: { [Op.in]: ["Pending", "Approved"] },
                    fromDate: { [Op.between]: [new Date(year,0,1), new Date(year,month,0)] }
                }
            });

            const usedCL = clRequests.reduce((total, req) => {
                const fromReq = new Date(req.fromDate);
                const toReq = new Date(req.toDate);
                const daysReq = Math.ceil((toReq - fromReq) / (1000 * 60 * 60 * 24)) + 1;
                return total + daysReq;
            }, 0);


            const availableCL = earnedCLTotal - usedCL;

            if(availableCL < 1){
                return res.status(400).json({ message: "No CL balance available" });
            }

            if(days > availableCL){
                return res.status(400).json({ message: `Only ${availableCL} CL available` });
            }
        }

        if (leaveType === "SL") {
        const availableSL = balance.slTotal - balance.slUsed;

        if (days > availableSL) {
            return res.status(400).json({
            message: `Only ${availableSL} SL available`
            });
        }
        }

    // ---------------- PL LOGIC ----------------
        if (leaveType === "PL") {
        const availablePL = balance.plTotal - balance.plUsed;

        if (days > availablePL) {
            return res.status(400).json({
            message: `Only ${availablePL} PL available`
            });
        }
        }

        await LeaveRequest.create({
            empid,
            leaveType,
            fromDate,
            toDate,
            days,
            status: "Pending"
        })

        res.json({message: "Leave applied successfully"})
    } catch(err){
        console.log(err)
        res.status(500).json({message: "server error"})
    }
})

router.put('/:id/action', async (req, res) => {
    try{
        const {id} = req.params
        const {status} = req.body

        const leave = await LeaveRequest.findByPk(id)

        if (!leave) {
            return res.status(404).json({ message: "Leave not found" });
            }

        if (leave.status !== "Pending") {
            return res.status(400).json({ message: "Already processed" });
        }

        leave.status=status
        await leave.save()

        if (status === "Approved") {
        const balance = await EmployeeLeaveBalance.findOne({
            where: { empid: leave.empid },
        });

        if (leave.leaveType === "CL") {
            balance.clUsed += leave.days;
        } else if (leave.leaveType === "SL") {
            balance.slUsed += leave.days;
        } else if (leave.leaveType === "PL") {
            balance.plUsed += leave.days;
        }

        await balance.save();
        }

        res.json({ message: `Leave ${status} successfully` });
        } catch(err){
            console.error(err);
        res.status(500).json({ message: "Server error" });
        }
})

router.get("/today/:empid", async (req, res) => {
    try{
        const {empid} = req.params

        const today = new Date().toISOString().slice(0, 10)

        const leave = await LeaveRequest.findOne({
            where: {
                empid,
                status: {[Op.in]: ["Pending", "Approved"]},
                fromDate: { [Op.lte]: today },
                toDate: { [Op.gte]: today },
            }
        })

        res.json({hasLeave: !!leave})
    }catch(err){
        res.status(500).json({message: "server error"})
    }
})
export { router as LeaveRouter}
