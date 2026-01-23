import multer from "multer";
import path from 'path'

const storage = multer.diskStorage({
    destination: "uploads/tickets",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
})

export const uploadTicketImg = multer({
    storage,
    fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPG, PNG, and PDF files are allowed"), false);
    }
    },
    limits: { fileSize: 5 * 1024 * 1024 }
})