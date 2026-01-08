import express from 'express'
import { EmployeeDocument } from '../models/EmployeeDocument.js'
import { uploadEmployeeDocs } from '../middleware/uploadEmployeeDocs.js'
import fs from 'fs'
import path from 'path'

// Ensure upload directory exists
const uploadDir = path.join('uploads', 'employee-docs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const router = express.Router()

const uploadFields = uploadEmployeeDocs.fields([
    {name: "photo", maxCount: 1},
    {name: "aadhar", maxCount: 1},
    {name: "pan", maxCount: 1},
    {name: "license", maxCount: 1},
])
router.post("/upload", uploadFields, async (req, res) => {
    try{
        const {empid} = req.body

        const files = req.files || {}

         // Check if record exists
        let employeeDoc = await EmployeeDocument.findOne({ where: { empid } });
        if (!employeeDoc) {
            employeeDoc = await EmployeeDocument.create({
                empid,
                photo: req.files.photo?.[0]?.filename || null,
                aadhar: req.files.aadhar?.[0]?.filename || null,
                pan: req.files.pan?.[0]?.filename || null,
                license: req.files.license?.[0]?.filename || null,
            });
        } else {
            // Update only uploaded fields
            ["photo", "aadhar", "pan", "license"].forEach((field) => {
                if (req.files[field]) {
                    employeeDoc[field] = req.files[field][0].filename;
                }
            });
            await employeeDoc.save();
        }

        res.status(201).json({
            message: "Documents uploaded successfully",
            data: employeeDoc,
        });
    }catch(err){
        res.status(500).json({ message: "Server Error", error: err.message });
    }
})

router.get("/:empid", async (req, res) => {
    try{
        const {empid} = req.params

        const document = await EmployeeDocument.findOne({
            where: {empid}
        })

        if (!document) {
        return res.status(404).json({
            message: "No documents found for this employee",
        });
        }

        res.status(200).json({
        message: "Employee documents fetched",
        data: document,
        })
    }catch(err){
        res.status(500).json({
        message: "Server Error",
        error: err.message,
        })
    }
})

router.delete("/:empid/:field", async (req, res) => {
  const { empid, field } = req.params; // e.g., field = 'photo' or 'aadhar'
  const allowedFields = ["photo", "aadhar", "pan", "license"];

  if (!allowedFields.includes(field)) {
    return res.status(400).json({ status: false, message: "Invalid document field" });
  }

  try {
    // Find the employee document record
    const doc = await EmployeeDocument.findOne({ where: { empid } });

    if (!doc || !doc[field]) {
      return res.status(404).json({ status: false, message: "Document not found" });
    }

    // Delete the file from uploads folder
    const filePath = path.join(process.cwd(), "uploads", "employee-docs", doc[field]);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Set the field to null in database
    doc[field] = null;
    await doc.save();

    res.json({ status: true, message: `${field} deleted successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Server error" });
  }
});

export { router as EmployeeDocumentRouter };

