import express from "express";
import Ticket from "../models/Ticket.js";

const router = express.Router()

router.post("/", async (req, res) => {
    try{
        const { empId, empName, category, subject, description, priority} = req.body

        if (!empId || !empName || !category || !subject || !description ) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const ticket = await Ticket.create({
            empId,
            empName,
            category,
            subject,
            description,
            priority,
            status: "Open",
        })

        res.status(201).json({
            message: "Ticket raised successfully",
            ticket,
        })
    }catch(err){
        console.error("Error creating task:", err);
        res.status(500).json({ message: "Server error" });
    }
})

router.get("/:empid", async (req, res) => {
    try {
        const { empid } = req.params

        const tickets = await Ticket.findAll({
        where: { empId: empid },
        order: [["createdAt", "DESC"]],
        });

        if (!tickets.length) {
        return res.status(404).json({
            message: "No tickets found for this employee",
        });
        }

        res.status(200).json(tickets)
    } catch (err) {
        console.error("Error fetching tickets:", err);
        res.status(500).json({ message: "Server error" });
    }
})

router.get("/", async (req, res) => {
    try{
        const ticket = await Ticket.findAll({
            order: [["createdAt", "DESC"]],
        })
        res.status(200).json(ticket)
    }catch(err){
        res.status(500).json({ message: "Server error"})
    }
})

router.patch("/:id/status", async (req, res) => {
    try{
        const { status } = req.body

        const ticket = await Ticket.findByPk(req.params.id)
        
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        ticket.status = status
        await ticket.save()

        res.json(ticket)
    }catch(err){
        res.status(500).json({ message: err.message})
    }
})

router.delete("/:id", async (req, res) => {
    try{
        const ticket = await Ticket.findByPk(req.params.id)
        
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" })
        }
        await ticket.destroy()

        res.json({message: "Ticket deleted successfully"})
    }catch(err){
        res.status(500).json({ message: err.message });

    }
})

export { router as TicketRouter}