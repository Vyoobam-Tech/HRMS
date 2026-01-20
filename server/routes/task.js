import express from 'express'
import Task from '../models/Task.js'


const router = express.Router()

router.post("/", async (req, res) => {
    try{
        const { empId, taskTitle, description, dueDate, priority, assignedBy } = req.body

        if(!empId || !taskTitle || !description || !dueDate || !priority) {
            return res.status(400).json({message: "All fields are required"})
        }

        const newTask = await Task.create({
            empId,
            taskTitle,
            description,
            dueDate,
            priority: "Medium",
            assignedBy
        })

        res.status(201).json(newTask)
    }catch(err){
        console.error("Error creating task:", err);
        res.status(500).json({ message: "Server error" });
    }
})


router.get("/:empid", async (req, res) => {
    try{
        const { empid } = req.params

        const tasks = await Task.findAll({
            where:  { empId: empid },
            order: [["createdAt", "DESC"]]
        })

        res.json(tasks)
    }catch(err){
        res.status(500).json({ message: "Failed to fetch tasks" });
    }
})

router.get("/", async (req, res) => {
    try{
        const tasks = await Task.findAll({
            order: [["createdAt", "DESC"]]
        })
        res.json(tasks)
    } catch(err){
        res.status(500).json({ message: err.message })
    }
})

router.put("/:id/status", async (req, res) => {
    try {
        const { status } = req.body;

        const task = await Task.findByPk(req.params.id);
        if (!task) {
        return res.status(404).json({ message: "Task not found" });
        }

        task.status = status;
        await task.save();

        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.delete("/:id", async (req, res) => {
    try{
        const tasks = await Task.findByPk(req.params.id)
        
        if (!tasks) {
            return res.status(404).json({ message: "Tasks not found" })
        }
        await tasks.destroy()

        res.json({message: "Tasks deleted successfully"})
    }catch(err){
        res.status(500).json({ message: err.message });

    }
})
export {router as TaskRouter}