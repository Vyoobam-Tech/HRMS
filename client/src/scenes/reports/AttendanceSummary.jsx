import React, { useState } from 'react'
import Header from '../../Components/Header'
import { Box } from '@mui/system'
import { Button, Divider, MenuItem, Paper, TextField, Typography } from '@mui/material'
import { PieChart } from '@mui/x-charts'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAttendanceSummary, fetchOTSummary } from '../../features/attendanceSummarySlice'
import { Tabs, Tab } from "@mui/material";


const getCurrentWeekRange = () => {
    const today = new Date();
    const day = today.getDay(); // 0 = Sunday, 1 = Monday

    const diffToMonday = day === 0 ? -6 : 1 - day;

    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return { monday, sunday };
  };

const AttendanceSummary = () => {

  const [empId, setEmpId] = useState("")
  const [type, setType] = useState("")
  const [month, setMonth] = useState("")
  const [year, setYear] = useState("")
  const [tab, setTab] = useState(0);

  const [otType, setOtType] = useState("")
  const [otMonth, setOtMonth] = useState("");
  const [otYear, setOtYear] = useState("")

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };


  const dispatch = useDispatch();

  const { data: summary, ot: otSummary, loading, error } = useSelector(
    (state) => state.attendanceSummary
  );



    const handleOTCheck = () => {
      if (!empId || !otType) return;


      if (otType === "Weekly") {
        const { monday, sunday } = getCurrentWeekRange();

        dispatch(
          fetchOTSummary({
            empid: empId,
            type: "Weekly",
            startDate: monday.toISOString().split("T")[0],
            endDate: sunday.toISOString().split("T")[0],
          })
        );
      }

      if (otType === "Monthly") {
        if (!otMonth || !otYear) return;

        dispatch(
          fetchOTSummary({
            empid: empId,
            type: "Monthly",
            month: otMonth,
            year: otYear,
          })
        );
      }
    };



  const months = [
    { num: 1, name: "January" },
    { num: 2, name: "February" },
    { num: 3, name: "March" },
    { num: 4, name: "April" },
    { num: 5, name: "May" },
    { num: 6, name: "June" },
    { num: 7, name: "July" },
    { num: 8, name: "August" },
    { num: 9, name: "September" },
    { num: 10, name: "October" },
    { num: 11, name: "November" },
    { num: 12, name: "December" },
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({length: 11}, (_,i) => currentYear - 5 + i)

  const handleCheck = () => {
      if (!empId || !type || !year) return;
      if (type === "Monthly" && !month) return

      dispatch(
        fetchAttendanceSummary({
          empid: empId,
          type,
          month,
          year,
        })
      );
    }



  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        padding: "120px 40px 20px 40px",
        boxSizing: "border-box",
      }}
    >
      <Header title="REPORTS"/>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Attendance Summary" />
          <Tab label="Overtime (OT)" />
        </Tabs>
      </Box>

      {tab === 0 && (
        <>
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        sx={{ 
          background: "white",
          p: 2,
          borderRadius: "10px"
        }}
      >
        <Typography variant="h6" >
          Attendance Summary
        </Typography>
        <TextField
          label="Emp ID"
          value={empId}
          onChange={(e) => setEmpId(e.target.value)}
        />
        <TextField
          select
          sx={{ width: 120 }}
          label="Type"
          value={type}
          onChange={(e) => {
            setType(e.target.value)
            setMonth("")
          }}
        >
          <MenuItem value="Monthly">Monthly</MenuItem>
          <MenuItem value="Yearly">Yearly</MenuItem>
        </TextField>
        {type === "Monthly" && (
          <>
            <TextField
              select
              sx={{ width: 150 }}
              label="Month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              {months.map((m) => (
                <MenuItem key={m.num} value={m.num}>
                  {m.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Year"
              sx={{ width: 150 }}
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              {years.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </TextField>
          </>
        )}

        {type === "Yearly" && (
          <>
            <TextField
              select
              label="Year"
              sx={{ width: 150 }}
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              {years.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </TextField>
          </>
        )}
        <Button
          variant='contained'
          color='primary'
          onClick={handleCheck}
          disabled={!empId}
        >
          Check
        </Button>
      </Box>

      {summary && (
            <Box display="flex" alignItems="center" sx={{ m: 2 }}>
              <Box >
                <Typography sx={{ color: "black" }}>
                  <span style={{ fontWeight: "bold" }}>Emp ID : </span> {summary.empid}
                </Typography>
                <Typography sx={{ color: "black" }}>
                  <span style={{ fontWeight: "bold" }}>Period :</span> {summary.period}
                </Typography>
                <Typography sx={{ color: "black" }}>
                  <span style={{ fontWeight: "bold" }}>Working Days :</span> {summary.workingDays}
                </Typography>
                <Typography sx={{ color: "black" }}>
                  <span style={{ fontWeight: "bold" }}>Present :</span> {summary.present}
                </Typography>
                <Typography sx={{ color: "black" }}>
                  <span style={{ fontWeight: "bold" }}>Half Day :</span> {summary.halfday}
                </Typography>
                <Typography sx={{ color: "black" }}>
                  <span style={{ fontWeight: "bold" }}>Absent :</span> {summary.absent}
                </Typography>
                <Typography sx={{ color: "black" }}>
                  <span style={{ fontWeight: "bold"}}>Total Present : </span> {summary.total} days
                </Typography>
              </Box>

              <Box>
                <PieChart
                  series={[
                    {
                      data: [
                        {id: 0, value: summary.present, color: "#5DD39E", label: "Present"},
                        {id: 1, value: summary.absent, color: "#B497D6", label: "Absent"},
                        {id: 3, value: summary.halfday, color: "#55C1E7", label: "Halfday"}
                      ]
                    }
                  ]}
                  width={400}
                  height={250}
                  tooltip={{ trigger: "item" }}
                />
              </Box>
            </Box>
        )}
        </>
      )}

      {tab === 1 && (
        <>
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          sx={{
            background: "white",
            p: 3,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mr: 2 }}>
            Overtime (OT) Check
          </Typography>

          <TextField
            label="Emp ID"
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
            sx={{ width: 140 }}
          />

          <TextField
            select
            label="Type"
            sx={{ width: 140 }}
            value={otType}
            onChange={(e) => {
              setOtType(e.target.value);
              setOtMonth(""); // reset month when switching
            }}
          >
            <MenuItem value="Weekly">Weekly</MenuItem>
            <MenuItem value="Monthly">Monthly</MenuItem>
          </TextField>

          {otType === "Weekly" && (
            <Typography
              sx={{
                fontWeight: 500,
                color: "gray",
                ml: 1,
              }}
            >
              Week:&nbsp;
              {getCurrentWeekRange().monday.toLocaleDateString()} –{" "}
              {getCurrentWeekRange().sunday.toLocaleDateString()}
            </Typography>
          )}


          {otType === "Monthly" && (
            <>
              <TextField
                select
                label="Month"
                sx={{ width: 150 }}
                value={otMonth}
                onChange={(e) => setOtMonth(e.target.value)}
              >
                {months.map((m) => (
                  <MenuItem key={m.num} value={m.num}>
                    {m.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Year"
                sx={{ width: 120 }}
                value={otYear}
                onChange={(e) => setOtYear(e.target.value)}
              >
                {years.map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </TextField>
            </>
          )}

          <Button
            variant="contained"
            onClick={handleOTCheck}
            disabled={
              !empId
            }
          >
            Check OT
          </Button>
        </Box>
        {otSummary && (
          <Box sx={{ mt: 3 }}>
            <Typography>
              <b>Emp ID:</b> {otSummary.empid}
            </Typography>
            <Typography>
              <b>Period:</b> {otSummary.period}
            </Typography>
            <Typography>
              <b>Total OT:</b> {otSummary.overtime}
            </Typography>
            <Typography>
              <b>Days with OT:</b> {otSummary.daysWithOT}
            </Typography>
          </Box>
        )}
</>
        
      )}
    </div>
  )
}

export default AttendanceSummary