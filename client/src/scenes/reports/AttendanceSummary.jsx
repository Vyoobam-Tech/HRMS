import React, { useState } from 'react'
<<<<<<< HEAD
import Header from '@/components/Header.jsx'
=======
import Header from '../../components/Header'
>>>>>>> parent of 25f6374 (header fix)
import { Box } from '@mui/system'
import { Button, Divider, MenuItem, Paper, TextField, Typography } from '@mui/material'
import { PieChart } from '@mui/x-charts'

const AttendanceSummary = () => {

  const [empId, setEmpId] = useState("")
  const [type, setType] = useState("")
  const [month, setMonth] = useState("")
  const [year, setYear] = useState("")
  const [summary, setSummary] = useState(null)

  const API_URL = import.meta.env.VITE_API_BASE_URL

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

  const handleCheck = async () => {
    const res = await fetch(`${API_URL}/api/attendance/summary?empid=${empId}&month=${month}&year=${year}`);
    const data = await res.json()
    setSummary(data)
  }

  return (
    <div
      style={{
        height: 450,
        width: "80%",
        marginRight: "60px",
        paddingTop: "140px",
      }}
    >
      <Header title="ATTENDANCE SUMMARY "/>

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
          onChange={(e) => setType(e.target.value)}
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

    </div>
  )
}

export default AttendanceSummary