import express from 'express'
import { Policy } from '../models/Policy.js'
import { uploadPolicy } from '../middleware/uploadPolicy.js'
import fs from 'fs'
import path from 'path'

const router = express.Router()


router.post("/", uploadPolicy.single("policy"), async (req, res) => {
    try{
        const {title} = req.body

        if(!title && !req.file){
            return res.status(400).json({message: "Title and PDF are required"})
        }

        const policy = await Policy.create({
            title,
            file_name: req.file.filename
        })
        res.status(201).json({message: "Policy added succesfully", policy})
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

router.get("/", async (req, res) => {
    try{
        const policies = await Policy.findAll({
            order: [['createdAt', 'DESC']]
        })

        res.json({
            status: true,
            policies
        })
    }catch(err){
        res.status(500).json({ message: err.message })
    }
})

router.get("/download/:filename", (req, res) => {
    const filePath = path.join(process.cwd(), "uploads/policies", req.params.filename)
    res.download(filePath)
})


router.delete("/:id", async (req, res) => {
    try{
        const policy = await Policy.findByPk(req.params.id)

        if (!policy) {
            return res.status(404).json({ message: "Policy not found" })
        }

        const filePath = path.join(
            process.cwd(),
            "upload/policies",
            policy.file_name
        )

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            }

        await policy.destroy()

        res.json({message: "Policy deleted successfully"})
    }catch(err){
        res.status(500).json({ message: err.message });
    }
})
export {router as PolicyRouter}