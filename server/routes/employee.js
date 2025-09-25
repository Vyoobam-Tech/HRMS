import express from "express";
import { Employee } from "../models/Employee.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("Received Data:", req.body);

    const newEmployee = await Employee.create(req.body);
    return res.json({
      status: true,
      message: "Employee added successfully",
      data: newEmployee,
    });
  } catch (err) {
    console.error("Error creating employee:", err.message, err.stack);

    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        status: false,
        message: "Email ID already exists. Please use a different email.",
      });
    }

    return res.status(500).json({
      status: false,
      message: "Failed to add employee",
      error: err.message,
    });
  }
});

router.get("/all", async (req, res) => {
  try {
    const employees = await Employee.findAll();
    return res.json({ status: true, data: employees });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, message: "Failed to fetch employees" });
  }
});

router.get("/:empid", async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.empid);
    if (!employee)
      return res
        .status(404)
        .json({ status: false, message: "Employee not found" });
    return res.json({ status: true, data: employee });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, message: "Failed to fetch employee" });
  }
});

router.put("/update/:empid", async (req, res) => {
  try {
    const [updated] = await Employee.update(req.body, {
      where: { empid: req.params.empid },
    });

    if (!updated) {
      return res
        .status(404)
        .json({ status: false, message: "Employee not found" });
    }

    const updatedEmployee = await Employee.findOne({
      where: { empid: req.params.empid },
    });

    return res.json({
      status: true,
      message: "Employee updated successfully",
      data: updatedEmployee,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, message: "Failed to update employee" });
  }
});

router.delete("/delete/:empid", async (req, res) => {
  try {
    const deleted = await Employee.destroy({
      where: { empid: req.params.empid },
    });
    if (!deleted)
      return res
        .status(404)
        .json({ status: false, message: "Employee not found" });
    return res.json({ status: true, message: "Employee deleted successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, message: "Failed to delete employee" });
  }
});

export { router as EmployeeRouter };
