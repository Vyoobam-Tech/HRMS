import express from "express"
import { Holiday } from "../models/Holiday.js"

const router = express.Router()

router.post("/", async (req, res) => {
    try{
        const { date, day, name, type} = req.body

        const holiday = await Holiday.create({
            date,
            day,
            name,
            type,
        })
        res.status(201).json({success: true, data: holiday})
    }catch(err){
        res.status(500).json({success: false, err})
    }
})

router.get("/all", async (req, res) => {
    try{
        const holiday = await Holiday.findAll()
        res.status(200).json({success: true, data: holiday})
    }catch(err){
        res.status(500).json({success: false, message: "Error fetching holiday"})
    }
})

export { router as HolidayRouter}
