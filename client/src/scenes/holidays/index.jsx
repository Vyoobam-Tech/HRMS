import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Button, IconButton, MenuItem, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import Header from "../../Components/Header";
import { Box } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from 'react-redux';
import { addHoliday, deleteHoliday, fetchHoliday } from "../../features/holidaySlice";
import { fetchProfile } from "../../features/auth/authSlice";

const Holidays = () => {
  const [gridKey, setGridKey] = useState(0);

  const dispatch = useDispatch();
  const { user, loading: authLoading, error: authError } = useSelector(
  (state) => state.auth
  )
  const { holidays, loading, error } = useSelector((state) => state.holiday);
  const [holidayForm, setHolidayForm] = useState({
    date: "",
    day: "",
    name: "",
    type: "",
    status: ""
  })

  const holidaycolumn = [
    {headerName: "Action",
      field: "action",
      hide: user?.role !== "superadmin",
      cellRenderer: (params) => {
        return (
        <>
          <IconButton
            onClick={() => handleDelete(params.data.id)}
            color="error"
            size="small"
          >
            <DeleteIcon />
          </IconButton>
          </>
        )
      },
      width: 80,
    },
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
      dispatch(fetchProfile());
    }, [dispatch]);

  useEffect(() => {
    dispatch(fetchHoliday());
  }, [dispatch]);

  const handleAdd = () => {
    const { date, type, name, day } = holidayForm;
    
    if (!date || !type || !name) return;

    dispatch(addHoliday({ date, type, name, day }));

    setHolidayForm({
      date: "",
      day: "",
      name: "",
      type: "",
    });
  };


  const handleDelete = (id) => {
    dispatch(deleteHoliday(id))
  }

  const role = user?.role


  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        padding: "120px 40px 20px 40px",
        boxSizing: "border-box",
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
          <MenuItem value="CH">NH</MenuItem>
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
        rowData={holidays}
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
