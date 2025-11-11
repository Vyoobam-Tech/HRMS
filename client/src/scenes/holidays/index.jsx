import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Button, MenuItem, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import Header from "../../Components/Header";
import hrmsData from "../../data/hrmsData.json"
import { Box } from "@mui/system";
import API from "../../api/axiosInstance";

const Holidays = () => {
  const [rowData, setRowData] = useState([]);
  const [gridKey, setGridKey] = useState(0);
  const [user, setUser] = useState(null)
  const [holidayForm, setHolidayForm] = useState({
    date: "",
    day: "",
    name: "",
    type: "",
    status: ""
  })

  const holidaycolumn = [
    {headerName: "Date",
      field: "date",
      sortable: true,
      sort: "desc",
      valueFormatter: (params) => {
        if(!params.value) return ''
        const formattedDate = new Date(params.value)
        return formattedDate.toLocaleDateString("en-Gb", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        })
      }
    },
    {headerName: "Day", field: "day"},
    {headerName: 'Holidays', field: "name"},
    {headerName: "Type", field: "type", maxWidth:90},
    {headerName: "Status",
      valueGetter: (params) => {
        if(!params.data.date) return ''

        const holidayDate = new Date(params.data.date)
        const today = new Date()
        today.setHours(0,0,0,0)
        holidayDate.setHours(0,0,0,0)

        return holidayDate < today ? "Completed" : "Active"
      },
      field: "status",
      maxWidth: 140,
      cellStyle: (params) => {
        if(params.value === 'Completed') {
          return {color : 'red' }
        }
        if(params.value === 'Active') {
          return {color : 'green' }
        }
      }
    },
  ]


  useEffect(() => {
    const fetchUser = async () => {
      try{
        const response = await API.get("/auth/profile")
        if(response.data.status){
          setUser(response.data.user)
        }
      } catch(err) {
        console.log(err)
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const fetchHoliday = async () => {
      try{
        const response = await API.get("/api/holiday/all")
        if(response.data.success){
          setRowData(response.data.data)
        }
      }catch(err){
        console.log(err)
      }
    }
    fetchHoliday()
  }, [])

  const handleAdd = async () => {
    const { date, type } = holidayForm
    if (!date || !type ){
      return
    }
    try{
      const response = await API.post("/api/holiday", {
        date: holidayForm.date,
        day: holidayForm.day,
        name: holidayForm.name,
        type: holidayForm.type,
      })
      if(response.data.success){
        const newHoliday = response.data.data
        setRowData([...rowData, newHoliday])
      }

      setHolidayForm({
        date: "",
        day: "",
        name: "",
        type: "",
      })
    }catch(err){
      console.log(err)
    }
  }

  const role = user?.role


  return (
    <div
      style={{
        height: 450,
        width: 820,
        marginRight: "60px",
        paddingTop: "100px",
        marginLeft: "30px",
      }}
    >
      <Header title="HOLIDAYS" subtitle="Organisation Holidays Details" />

      {(role === "admin") || (role === "superadmin") && (
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        mb={2}
        sx={{
          background: "#f8f9fa",
          p: 2,
          borderRadius: "10px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}

      >

        <TextField
          type="date"
          label="Select Date"
          value={holidayForm.date}
          onChange={(e) => {
            const selectDate = e.target.value
            const dateObj = new Date(selectDate)
            const dayName = dateObj.toLocaleDateString("en-US", {weekday: "long"})

            setHolidayForm({
              ...holidayForm,
              date: selectDate,
              day: dayName
            })
          }
          }
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Day"
          value={holidayForm.day}
        />
        <TextField
          label="Holiday Name"
          value={holidayForm.name}
          onChange={(e) => setHolidayForm({...holidayForm, name: e.target.value})}
        />
        <TextField
          select
          sx={{ width: 100 }}
          label="Type"
          value={holidayForm.type}
          onChange={(e) => setHolidayForm({...holidayForm, type: e.target.value})}
        >
          <MenuItem value="">Select</MenuItem>
          <MenuItem value="RH">RH</MenuItem>
          <MenuItem value="CH">CH</MenuItem>
        </TextField>
        <Button
          variant="contained"
          onClick={handleAdd}
        >
          Add
        </Button>

      </Box>
      )}

      <AgGridReact
        key={gridKey}
        rowData={rowData}
        columnDefs={holidaycolumn}
        domLayout="autoHeight"
        onGridReady={(params) => {
          params.api.sizeColumnsToFit()
        }}
      />
    </div>
  );
};

export default Holidays;
