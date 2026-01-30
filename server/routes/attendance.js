import express from 'express'
import { Attendance } from '../models/Attendance.js'
import { Holiday } from "../models/Holiday.js"
import { Op } from "sequelize";

const router = express.Router()

const calculateOvertime = (
    login,
    logout,
    breakMinutes = 0,
    lunchMinutes = 0
    ) => {
    if (!login || !logout) return 0;

    const today = new Date().toISOString().split("T")[0];

    const loginTime = new Date(`${today}T${login}`);
    const logoutTime = new Date(`${today}T${logout}`);

    let workedMinutes = Math.floor((logoutTime - loginTime) / 60000);

    workedMinutes -= (Number(breakMinutes) + Number(lunchMinutes));

    const REQUIRED_MINUTES = 9 * 60;

    if (workedMinutes <= REQUIRED_MINUTES) return 0;

    let otMinutes = workedMinutes - REQUIRED_MINUTES;

    // Minimum 30 mins OT
    if (otMinutes < 30) return 0;

    // Round DOWN to 30 min blocks
    return Math.floor(otMinutes / 30) * 30;
};

const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const formatHours = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  return `${hours}h ${minutes}m`;
};



router.post("/", async (req, res) => {
    try{
        const {empid, name, attendancedate, login, breakminutes, lunchminutes, logout, totalminutes, totalhours, status} = req.body

        const otMinutes = calculateOvertime(
            login,
            logout,
            breakminutes,
            lunchminutes
            );


        const attendance = await Attendance.create({
          empid,
          name,
          attendancedate,
          login,
          breakminutes: Math.floor(toNumber(breakminutes)),
          lunchminutes: Math.floor(toNumber(lunchminutes)),
          logout,
          totalminutes: Math.floor(toNumber(totalminutes)),
          totalhours: formatHours(toNumber(totalminutes)),
          overtimeminutes: Math.floor(otMinutes),
          overtime: `${Math.floor(otMinutes / 60)}h ${otMinutes % 60}m`,
          status
        })

        res.status(201).json({
            success: true,
            message: "Attendance Created",
            data: attendance
        })
    } catch(err){
        res.status(500).json({ success: false, message: "Error creating attendance",err})
    }
})

router.get("/all", async (req, res) => {
    try{
        const employeeAttendance = await Attendance.findAll()
        return res.json({status: true, data: employeeAttendance})
    } catch(err) {
        console.log(err)
        res.status(500).json({status: false, message: "Failed to fetch Attendance"})
    }
})

router.put("/:id", async (req, res) => {
    try{
        const {id} = req.params
        const {login, breakminutes, lunchminutes, logout, totalminutes, totalhours, status} = req.body

        const attendance = await Attendance.findByPk(id)
        if (!attendance) {
            return res.status(404).json({success: false, message: "Attendance not found"})
        }

        const otMinutes = calculateOvertime(
            login,
            logout,
            breakminutes,
            lunchminutes
            );

        attendance.login = login
        attendance.breakminutes = toNumber(breakminutes);
        attendance.lunchminutes = toNumber(lunchminutes);
        attendance.logout = logout
        attendance.totalminutes = toNumber(totalminutes);
        attendance.totalhours = totalhours
        attendance.overtimeminutes = otMinutes;
        attendance.overtime = `${Math.floor(otMinutes / 60)}h ${otMinutes % 60}m`;
        attendance.status = status

        await attendance.save()

        res.status(200).json({success: true, message: "attendance updated successfully", data: attendance})
    } catch (err) {
        res.status(500).json({ success: false, message:"error updating attendance", err})
    }
})

router.get("/by-user/:empid", async (req, res) => {
    try{
        const attendance = await Attendance.findAll({
            where:{empid: req.params.empid}
        })

        return res.json({status: true, data: attendance})
    }catch(err){
        return res.status(500).json({status: false, message: err.message})
    }
})


router.get("/summary", async (req, res) => {
  try {
    const { empid, type, month, year } = req.query;

    if (!empid || !type || !year) {
      return res.status(400).json({ message: "Missing required params" });
    }

    let startDate, endDate, period;

    // 🔥 MONTHLY
    if (type === "Monthly") {
      if (!month) {
        return res.status(400).json({ message: "Month required for Monthly" });
      }

      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0);
      period = `${month}/${year}`;
    }

    // 🔥 YEARLY
    if (type === "Yearly") {
      startDate = new Date(year, 0, 1);   // Jan 1
      endDate = new Date(year, 11, 31);   // Dec 31
      period = `${year}`;
    }

    const attendance = await Attendance.findAll({
      where: {
        empid,
        attendancedate: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    const holidays = await Holiday.findAll({
      where: {
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    const present = attendance.filter(a => a.status === "Present").length;
    const halfday = attendance.filter(a => a.status === "Half-day").length;

    const holidayDates = holidays.map(h =>
      new Date(h.date).toDateString()
    );

    let workingDays = 0;
    let current = new Date(startDate);

    while (current <= endDate) {
      if (!holidayDates.includes(current.toDateString())) {
        workingDays++;
      }
      current.setDate(current.getDate() + 1);
    }

    const presentHalfday = present + halfday * 0.5;
    const absent = Math.round((workingDays - presentHalfday) * 10) / 10;

    res.json({
      empid,
      period,
      workingDays,
      present,
      halfday,
      absent,
      total: presentHalfday,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error checking data" });
  }
});

router.get("/ot-summary", async (req, res) => {
  try {
    const { empid, type, month, year, startDate, endDate } = req.query;

    if (!empid || !type) {
      return res.status(400).json({ message: "empid and type required" });
    }

    let fromDate, toDate, period;

    // ✅ WEEKLY (Frontend sends startDate & endDate)
    if (type === "Weekly") {
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Week dates required" });
      }

      fromDate = new Date(startDate);
      toDate = new Date(endDate);
      period = "Weekly";
    }

    // ✅ MONTHLY
    if (type === "Monthly") {
      if (!month || !year) {
        return res.status(400).json({ message: "Month & Year required" });
      }

      fromDate = new Date(year, month - 1, 1);
      toDate = new Date(year, month, 0);
      period = `${month}/${year}`;
    }

    const attendance = await Attendance.findAll({
      where: {
        empid,
        attendancedate: {
          [Op.between]: [fromDate, toDate],
        },
      },
    });

    const validOT = attendance.filter(a => a.overtimeminutes >= 30);

    const totalOTMinutes = validOT.reduce((sum, a) => sum + Number(a.overtimeminutes), 0);
    const daysWithOT = validOT.length;

    const otHours = Math.floor(totalOTMinutes / 60);
    const otMinutes = totalOTMinutes % 60;

    res.json({
      empid,
      period,
      daysWithOT,
      totalOTMinutes,
      overtime: `${otHours}h ${otMinutes}m`
    });


  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching OT summary" });
  }
});


router.delete('/:id', async (req, res) => {
    try{
        const {id} = req.params
        const attendance = await Attendance.findByPk(id)

        if (!attendance) {
            return res.status(404).json({ success: false, message: "Attendance not found" });
        }

        await attendance.destroy();

        res.status(200).json({ success: true, message: "Attendance deleted successfully", data: id });
    }catch(err){
        res.status(500).json({ success: false, message: "Error deleting attendance", err });

    }
})


export {router as AttendanceRouter}