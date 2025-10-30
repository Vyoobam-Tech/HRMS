import React, { useState } from 'react'
import Header from '../../components/Header'
import { Box } from '@mui/system'
import { Button, Divider, MenuItem, Paper, TextField, Typography } from '@mui/material'

const AttendanceSummary = () => {

  const [empId, setEmpId] = useState("")
  const [type, setType] = useState("")
  const [month, setMonth] = useState("")
  const [year, setYear] = useState("")
  const [summary, setSummary] = useState(null)

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
    const res = await fetch(`http://localhost:3000/api/attendance/summary?empid=${empId}&month=${month}&year=${year}`);
    const data = await res.json()
    setSummary(data)
  }

  return (
    <div
      style={{
        height: 450,
        width: "70%",
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
            <>
              <Typography>Emp ID : {summary.empid}</Typography>
              <Typography>Period : {summary.period}</Typography>
              <Typography>Working Days : {summary.workingDays}</Typography>
              <Typography>Present : {summary.present}</Typography>
              <Typography>Halfday : {summary.halfday}</Typography>
              <Typography>Absent : {summary.absent}</Typography>
              <Divider />
              <Typography>Total: {summary.total}</Typography>
            </>
        )}

    </div>
  )
}

export default AttendanceSummary