import express from "express"
import { Notification } from "../models/Notification.js"
import { Op } from "sequelize";

const router = express.Router()

router.post("/", async (req, res) => {
    try {
        const { title, message, empId } = req.body;

        const notification = await Notification.create({
        title,
        message,
        empId: empId || null,
        });

        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ message: "Error creating notification" });
    }
})

router.get("/:empId", async (req, res) => {
    try {
        const { empId } = req.params;

        const notifications = await Notification.findAll({
            where: {
                [Op.or]: [
                    { empId },
                    { empId: null }
                ],
            },
            order: [["createdAt", "DESC"]],
        });

        res.json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await Notification.findByPk(id);

        if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
        }

        await notification.destroy();

        res.json({ message: "Notification deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting notification" });
    }
})


export {router as NotificationRouter}