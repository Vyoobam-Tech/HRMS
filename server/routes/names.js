import express from "express";
import { Names } from "../models/Name.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!name || !name.trim()) {
      return res
        .status(400)
        .json({ status: false, message: "Name is required" });
    }

    if (!type || !["DEPARTMENT", "REPORT"].includes(type)) {
      return res
        .status(400)
        .json({ status: false, message: "Valid type is required" });
    }

    const newName = await Names.create({
      name: name.trim(),
      type,
    });

    return res.json({
      status: true,
      message: "Name added successfully",
      data: newName,
    });
  } catch (err) {
    console.error("Error adding name:", err.message);

    if (err.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({ status: false, message: "Name already exists" });
    }

    return res.status(500).json({
      status: false,
      message: "Failed to add name",
      error: err.message,
    });
  }
});

router.get("/all", async (req, res) => {
  try {
    const names = await Names.findAll({
      attributes: ["id", "name", "type"],
      order: [["name", "ASC"]],
    });

    return res.json({
      status: true,
      data: names,
      message: "Names fetched successfully",
    });
  } catch (err) {
    console.error("Error fetching names:", err.message);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch names",
      error: err.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Names.destroy({
      where: { id },
    });

    return res.json({
      status: true,
      message: "Deleted successfully",
    });
  } catch (err) {
    console.error("Delete error:", err.message);
    return res.status(500).json({
      status: false,
      message: "Failed to delete",
    });
  }
});

export { router as NamesRouter };
