import express from "express";
import { Department } from "../models/Department.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("Incoming data:", req.body);
    const {
      depid,
      name,
      // code,
      description,
      // branch,
      hod,
      // reporting,
      total,
      // budget,
      created,
      status,
    } = req.body;
    if (
      !depid ||
      !name ||
      // !code ||
      !description ||
      // !branch ||
      !hod ||
      // !reporting ||
      total == null ||
      // budget == null ||
      !status
    ) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields",
      });
    }

    const newDepartment = await Department.create({
      depid,
      name,
      // code,
      description,
      // branch,
      hod,
      // reporting,
      total: parseInt(total),
      // budget: parseInt(budget),
      created: created ? new Date(created) : new Date(),
      status,
    });

    return res.json({
      status: true,
      message: "Department created successfully",
      data: newDepartment,
    });
  } catch (err) {
    console.error("Error creating department:", err.message);
    console.error("Error stack trace:", err.stack);

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

router.put("/update/:depid", async (req, res) => {
  try {
    const [updated] = await Department.update(req.body, {
      where: { depid: req.params.depid },
    });

    if (!updated) {
      return res
        .status(404)
        .json({ status: false, message: "Department not found" });
    }

    const updatedDepartment = await Department.findOne({
      where: { depid: req.params.depid },
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

router.delete("/delete/:depid", async (req, res) => {
  try {
    const deleted = await Department.destroy({
      where: { depid: req.params.depid },
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
