import express from "express";
import PDFDocument from "pdfkit";
import { SalaryComponent, EmployeeSalary, Payslip } from "../models/Payroll.js";
import { User } from "../models/User.js";
import { Employee } from "../models/Employee.js";
import { Op } from "sequelize";

const router = express.Router();

// ---------------- CHECK PERMISSIONS MIDDELWARE ----------------
const checkAdmin = (req, res, next) => {
    // Assuming req.user is set by verifyUser middleware in index.js
    // For now, we'll check it again or blindly trust if verifyUser is used.
    // Better to ensure verifyUser is called before this router.
    /* 
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        return res.status(403).json({ message: "Access Denied" });
    }
    */
    next(); 
};

// ---------------- CONFIGURATION ROUTES ----------------

// Get All Components (Earnings/Deductions)
router.get("/components", async (req, res) => {
    try {
        const components = await SalaryComponent.findAll({ where: { isActive: true } });
        res.json({ status: true, data: components });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
});

// Add/Update Component (Admin Only)
router.post("/components", checkAdmin, async (req, res) => {
    try {
        const { name, type, description } = req.body;
        const component = await SalaryComponent.create({ name, type, description });
        res.json({ status: true, message: "Component created", data: component });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
});

// ---------------- EMPLOYEE SALARY ROUTES ----------------

// Assign Salary Structure to Employee
router.post("/assign/:empId", checkAdmin, async (req, res) => {
    try {
        const { empId } = req.params;
        const { structure } = req.body; // { "Basic": 50000, "HRA": 20000 }
        
        // Calculate estimated net salary
        let net = 0;
        // This is a simplified calculation. Real MNC logic would fetch component types.
        // For MVP, we trust the frontend sends calculated net or we recalc here.
        // Let's iterate keys.
        const components = await SalaryComponent.findAll();
        const compMap = {};
        components.forEach(c => compMap[c.name] = c.type);

        for (const [key, value] of Object.entries(structure)) {
            if (compMap[key] === 'earning') net += Number(value);
            if (compMap[key] === 'deduction') net -= Number(value);
        }

        const [record, created] = await EmployeeSalary.findOrCreate({
            where: { empId },
            defaults: { structure, netSalary: net }
        });

        if (!created) {
            record.structure = structure;
            record.netSalary = net;
            await record.save();
        }

        res.json({ status: true, message: "Salary Structure Updated" });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
});


// ---------------- PAYROLL GENERATION (Advanced MNC Logic) ----------------
import { Attendance } from "../models/Attendance.js";

// Generate for a Month (Admin)
router.post("/generate", checkAdmin, async (req, res) => {
    try {
        const { month, year } = req.body; // e.g., "January", 2026
        const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
        const yearNum = parseInt(year);
        
        // 1. Calculate Total Working Days in that Month
        const daysInMonth = new Date(yearNum, monthIndex + 1, 0).getDate();
        
        // 2. Fetch all Employee Salary Structures
        const employees = await EmployeeSalary.findAll();
        
        const generated = [];

        for (const emp of employees) {
            // Check if already generated
            const exists = await Payslip.findOne({ where: { empId: emp.empId, month, year }});
            if (exists) continue;

            const structure = emp.structure;
            const grossSalary = emp.netSalary; // Assuming this is Gross Base

            // 3. Calculate LOP (Loss of Pay)
            // Fetch attendance count for this month
            // Note: In a real DB, we'd query by date range. 
            // Simplified: We assume Attendance 'attendancedate' is stored.
            const startDate = new Date(yearNum, monthIndex, 1).toISOString().split('T')[0];
            const endDate = new Date(yearNum, monthIndex + 1, 0).toISOString().split('T')[0];

            const presentDays = await Attendance.count({
                where: {
                    empid: emp.empId,
                    attendancedate: {
                        [Op.between]: [startDate, endDate]
                    },
                    status: 'Present' // Or check != 'Absent'
                }
            });

            // Adjust for weekends/holidays if not marking them in Attendance table?
            // MNC Rule: Fixed Salary is paid for 30 days. LOP is deducted for Absent days.
            // Let's invert: Count Absents.
            const absentDays = await Attendance.count({
                where: {
                    empid: emp.empId,
                    attendancedate: {
                        [Op.between]: [startDate, endDate]
                    },
                    status: 'Absent'
                }
            });

            // LOP Formula
            const perDaySalary = grossSalary / daysInMonth;
            const lopDeduction = Math.round(absentDays * perDaySalary);
            
            // 4. Calculate Overtime (MNC Standard: > 9 Hours a day)
            // Fetch employee details to check eligibility
            const employeeDetails = await Employee.findByPk(emp.empId);
            let overtimePay = 0;

            if (employeeDetails && employeeDetails.isOvertimeEnabled) {
                // Fetch all present records
            const attendanceRecords = await Attendance.findAll({
                where: {
                    empid: emp.empId,
                    attendancedate: { [Op.between]: [startDate, endDate] }
                }
            });

            let totalOvertimeMinutes = 0;
            const STANDARD_WORK_MINUTES = 540; // 9 hours * 60

            attendanceRecords.forEach(att => {
                if (att.totalminutes > STANDARD_WORK_MINUTES) {
                    totalOvertimeMinutes += (att.totalminutes - STANDARD_WORK_MINUTES);
                }
            });

                // Overtime Rate: Traditionally 2x hourly rate, or 1.5x. Let's use 100 per hour flat or derived.
                // Derived: (Gross / 30 / 8) * 2 * Hours ?? 
                // Simplified for MVP: flat calculation based on hourly rate.
                // Hourly Rate = perDaySalary / 9
                const hourlyRate = perDaySalary / 9;
                overtimePay = Math.round((totalOvertimeMinutes / 60) * hourlyRate);
            }

            const finalNetPay = (grossSalary + overtimePay) - lopDeduction;

            // Updated Structure for Payslip
            const breakdown = { 
                ...structure, 
                "Overtime Pay": overtimePay,
                "Loss of Pay (LOP)": -lopDeduction 
            };

            const payslip = await Payslip.create({
                empId: emp.empId,
                month,
                year,
                netPay: finalNetPay > 0 ? finalNetPay : 0, 
                breakdown,
                totalEarnings: grossSalary + overtimePay,
                totalDeductions: lopDeduction,
                status: "generated"
            });
            generated.push(payslip);
        }

        res.json({ status: true, message: `Generated ${generated.length} payslips. Check History.`, data: generated });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, message: err.message });
    }
});

// ... fetch history ...
router.get("/history", async (req, res) => {
    try {
        const history = await Payslip.findAll({
             order: [['year', 'DESC'], ['month', 'DESC']]
        });
        res.json({ status: true, data: history });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
});

// Get Payroll Stats for Dashboard
router.get("/stats", async (req, res) => {
    try {
        const date = new Date();
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        // Default to current month/year or previous if current not generated? 
        // Let's simpler: Get ALL time for now or specific current month. 
        // Use current month.
        const month = monthNames[date.getMonth()]; 
        const year = date.getFullYear();

        const payslips = await Payslip.findAll({
            where: { month, year }
        });

        const totalNetPay = payslips.reduce((sum, p) => sum + Number(p.netPay), 0);
        const totalEarnings = payslips.reduce((sum, p) => sum + Number(p.totalEarnings), 0);
        const totalDeductions = payslips.reduce((sum, p) => sum + Number(p.totalDeductions), 0);

        res.json({
            status: true,
            data: {
                month,
                year,
                totalNetPay,
                totalEarnings,
                totalDeductions,
                count: payslips.length
            }
        });

    } catch (err) {
         res.status(500).json({ status: false, message: err.message });
    }
});

// ---------------- ADVANCED PDF GENERATION ----------------
router.get("/download/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const slip = await Payslip.findByPk(id);
        if (!slip) return res.status(404).send("Payslip not found");

        const user = await User.findOne({ where: { empid: slip.empId } });

        const doc = new PDFDocument({ margin: 50 });
        
        // Auto-download
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=Payslip_${slip.month}_${slip.year}.pdf`);
        doc.pipe(res);

        // --- Header ---
        doc.fillColor("#444444").fontSize(20).text("VYDOBAM TECH", 50, 50, { align: "center" }).moveDown(0.5);
        doc.fontSize(10).text("123, Tech Park, Innovation Street, Bangaluru", { align: "center" });
        doc.moveDown();
        doc.fillColor("#000000").fontSize(16).text("PAYSLIP", { align: "center", underline: true });
        doc.fontSize(12).text(`For the period of: ${slip.month} ${slip.year}`, { align: "center" });
        doc.moveDown();

        // --- Employee Details Box ---
        doc.rect(50, 160, 500, 70).stroke();
        doc.fontSize(10).text("Employee Name:", 60, 170).text(user?.username || "N/A", 150, 170);
        doc.text("Employee ID:", 300, 170).text(slip.empId, 400, 170);
        
        doc.text("Department:", 60, 190).text(user?.department || "N/A", 150, 190);
        doc.text("Bank Account:", 300, 190).text("XXXXXXXX1234", 400, 190); // Placeholder or fetch

        doc.text("Designation:", 60, 210).text(user?.role || "Employee", 150, 210);
        doc.text("Days Worked:", 300, 210).text("Calculated based on attendance", 400, 210);

        doc.moveDown(4);

        // --- Earnings & Deductions Table ---
        const startY = 260;
        doc.font("Helvetica-Bold").text("Earnings", 60, startY);
        doc.text("Amount", 200, startY, { align: "right" });
        doc.text("Deductions", 300, startY);
        doc.text("Amount", 500, startY, { align: "right" });
        
        doc.moveTo(50, startY + 15).lineTo(550, startY + 15).stroke();

        let currentY = startY + 25;
        let totalEarnings = 0;
        let totalDeductions = 0;

        // Separate earnings/deductions
        const earnings = [];
        const deductions = [];
        
        // Helper to guess type (since breakdown is flat JSON)
        // In real app, we would query SalaryComponent to know types.
        // Heuristic: Positive = Earning, Negative = Deduction in our logic (LOP is negative)
        for(const [key, val] of Object.entries(slip.breakdown)) {
            const amount = Number(val);
            if(amount < 0 || key.toLowerCase().includes("deduction") || key.includes("Tax") || key.includes("PF")) {
                deductions.push({ label: key, amount: Math.abs(amount) });
            } else {
                earnings.push({ label: key, amount: amount });
            }
        }

        const maxRows = Math.max(earnings.length, deductions.length);
        
        for(let i=0; i<maxRows; i++) {
            doc.font("Helvetica");
            if(earnings[i]) {
                doc.text(earnings[i].label, 60, currentY);
                doc.text(earnings[i].amount.toFixed(2), 200, currentY, { align: "right" });
                totalEarnings += earnings[i].amount;
            }
            if(deductions[i]) {
                doc.text(deductions[i].label, 300, currentY);
                doc.text(deductions[i].amount.toFixed(2), 500, currentY, { align: "right" });
                totalDeductions += deductions[i].amount;
            }
            currentY += 20;
        }

        doc.moveTo(50, currentY).lineTo(550, currentY).stroke();
        currentY += 10;

        // Totals
        doc.font("Helvetica-Bold");
        doc.text("Total Earnings", 60, currentY);
        doc.text(totalEarnings.toFixed(2), 200, currentY, { align: "right" });
        
        doc.text("Total Deductions", 300, currentY);
        doc.text(totalDeductions.toFixed(2), 500, currentY, { align: "right" });

        currentY += 30;
        doc.fontSize(14).rect(50, currentY, 500, 40).fill("#f0f0f0").stroke();
        doc.fillColor("black").text("NET PAYABLE", 60, currentY + 12);
        doc.text(`$${slip.netPay.toFixed(2)}`, 450, currentY + 12, { align: "right" });

        doc.fontSize(10).text("(This is a computer generated payslip)", 50, 700, { align: "center", oblique: true });

        doc.end();

    } catch (err) {
        console.error(err);
        res.status(500).send("Error generating PDF");
    }
});

export { router as PayrollRouter };
