import express from "express";
import { Activity } from "../models/Activity.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("Received Data:", req.body);

    const newActivity = await Activity.create(req.body);
    return res.json({
      status: true,
      message: "Activity added successfully",
      data: newActivity,
    });
  } catch (err) {
    console.error("Error creating activity:", err.message, err.stack);

    return res.status(500).json({
      status: false,
      message: "Failed to add activity",
      error: err.message,
    });
  }
});

router.get("/all", async (req, res) => {
  try {
    const activity = await Activity.findAll();
    return res.json({ status: true, data: activity });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, message: "Failed to fetch activity" });
  }
});

router.get("/:actid", async (req, res) => {
  try {
    const activity = await Employee.findByPk(req.params.actid);
    if (!activity)
      return res
        .status(404)
        .json({ status: false, message: "Activity not found" });
    return res.json({ status: true, data: activity });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, message: "Failed to fetch activity" });
  }
});

router.put("/update/:actid", async (req, res) => {
  try {
    const [updated] = await Activity.update(req.body, {
      where: { actid: req.params.actid },
    });

    if (!updated) {
      return res
        .status(404)
        .json({ status: false, message: "Activity not found" });
    }

    const updatedActivity = await Activity.findOne({
      where: { actid: req.params.actid },
    });

    return res.json({
      status: true,
      message: "Activity updated successfully",
      data: updatedActivity,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, message: "Failed to update activity" });
  }
});

router.delete("/delete/:actid", async (req, res) => {
  try {
    const deleted = await Activity.destroy({
      where: { actid: req.params.actid },
    });
    if (!deleted)
      return res
        .status(404)
        .json({ status: false, message: "Activity not found" });
    return res.json({ status: true, message: "Activity deleted successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, message: "Failed to delete activity" });
  }
});

export { router as ActivityRouter };
