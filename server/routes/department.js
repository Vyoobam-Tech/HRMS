import express from "express";
import { Department } from "../models/Department.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      // depid,
      code,
      name,
      reporting,
      email,
      // location,
      assigned,
      createdby,
      type,
      category,
      model,
      hod,
      total,
      status,
    } = req.body;

    // Basic validation
    if (!name || !hod || total == null || !status) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields",
      });
    }

    const newDepartment = await Department.create({
      code,
      name,
      reporting,
      email,
      assigned,
      createdby,
      type,
      category,
      model,
      hod,
      total: parseInt(total),
      status,
      created: new Date(),
    });

    return res.json({
      status: true,
      message: "Department created successfully",
      data: newDepartment,
    });
  } catch (err) {
    console.error("Error creating department:", err.message);
    return res.status(500).json({
      status: false,
      message: "Failed to add department",
      error: err.message,
    });
  }
});


router.get("/all", async (req, res) => {
  try {
    const department = await Department.findAll();
    return res.json({ status: true, data: department });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, message: "Failed to fetch department" });
  }
});

router.get("/:depid", async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.depid);
    if (!department)
      return res
        .status(404)
        .json({ status: false, message: "Department not found" });
    return res.json({ status: true, data: department });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, message: "Failed to fetch department" });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const [updated] = await Department.update(req.body, {
      where: { id: req.params.id },
    });

    if (!updated) {
      return res
        .status(404)
        .json({ status: false, message: "Department not found" });
    }

    const updatedDepartment = await Department.findOne({
      where: { id: req.params.id },
    });

    return res.json({
      status: true,
      message: "Department updated successfully",
      data: updatedDepartment,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, message: "Failed to update department" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await Department.destroy({
      where: { id: req.params.id },
    });
    if (!deleted)
      return res
        .status(404)
        .json({ status: false, message: "Department not found" });
    return res.json({
      status: true,
      message: "Department deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, message: "Failed to delete department" });
  }
});

export { router as DepartmentRouter };
