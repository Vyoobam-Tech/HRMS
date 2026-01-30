import { Button, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import Header from '../../Components/Header.jsx'
import PowerSettingsNewRoundedIcon from "@mui/icons-material/PowerSettingsNewRounded";
import { Box, Stack } from '@mui/system';
import { AgGridReact } from 'ag-grid-react';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import API from '../../api/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import Card from '@mui/material/Card';
import { fetchProfile } from '../../features/auth/authSlice.js';
import { addPermissionRow, fetchAttendanceByUser } from '../../features/attendanceSlice.js';

const EachEmployeeTimeTracker = () => {

    const dispatch = useDispatch()
    
    const { user, loading: authLoading, error: authError } = useSelector(
      (state) => state.auth
    )

    const {list: rowData} = useSelector((state) => state.attendance)

    useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch])

    useEffect(() => {
        if(!user?.empid) return
        dispatch(fetchAttendanceByUser(user.empid))
    }, [dispatch, user])


    const [columDefs] = useState([
        {headerName: "Date", field: "attendancedate"},
        {headerName: "Login", field: "login"},
        {headerName: "Break", field: "breakminutes"},
        {headerName: "Lunch", field: "lunchminutes"},
        {headerName: "Logout", field: "logout"},
        {headerName: "OT", field: "overtime"},
        {headerName: "Total Hours", field: "totalhours"},
         {
    headerName: "Permission",
    field: "permission",
    filter: false,
  },
    ])

    const defaultColDef = useMemo(() => ({
        filter: "agTextColumnFilter",
        floatingFilter: true
    }))

    const TOTAL_BREAK_MINUTES = 60;
    const today = new Date().toISOString().split("T")[0];

    const usedBreakMinutesToday = useMemo(() => {
      return rowData.reduce((total, row) => {
        if (!row.attendancedate || !row.breakminutes) return total;
        if (row.attendancedate !== today) return total;

        const minutes = parseInt(row.breakminutes.replace("m", ""), 10);
        return total + (isNaN(minutes) ? 0 : minutes);
      }, 0);
    }, [rowData, today]);

    const usedLunchMinutesToday = useMemo(() => {
      return rowData.reduce((total, row) => {
        if (!row.attendancedate || !row.lunchminutes) return total;
        if (row.attendancedate !== today) return total;

        const minutes = parseInt(row.lunchminutes.replace("m", ""), 10);
        return total + (isNaN(minutes) ? 0 : minutes);
      }, 0);
    }, [rowData, today]);


    const remainingBreakMinutes = Math.max(
      TOTAL_BREAK_MINUTES - (usedBreakMinutesToday + usedLunchMinutesToday),
      0
    );

    const OFFICE_START = "10:00";
    const GRACE_LIMIT_MINUTES = 30;

    const timeToMinutes = (time) => {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };

    let remainingGrace = GRACE_LIMIT_MINUTES;
    let isAbsent = false;

    const todayLoginTime = useMemo(() => {
      const todayRows = rowData.filter(
        (row) => row.attendancedate === today && row.login
      );

      if (todayRows.length === 0) return null;

      return todayRows[0].login;
    }, [rowData, today]);

    const formattedLoginTime = useMemo(() => {
      if (!todayLoginTime) return null;
      return todayLoginTime.slice(0, 5); 
    }, [todayLoginTime]);


    if (formattedLoginTime) {
      const officeStartMin = timeToMinutes(OFFICE_START);
      const loginMin = timeToMinutes(formattedLoginTime);
      if (loginMin <= officeStartMin) {
        remainingGrace = GRACE_LIMIT_MINUTES;
      }

      else if (loginMin > officeStartMin && loginMin < officeStartMin + GRACE_LIMIT_MINUTES) {
        remainingGrace = GRACE_LIMIT_MINUTES - (loginMin - officeStartMin);
      }
      
    else {
      isAbsent = true;
      remainingGrace = GRACE_LIMIT_MINUTES; // show actual grace, not deducted
    }

    }


    const currentMonth = new Date().getMonth();
    const savedMonth = localStorage.getItem("graceMonth");

    if (savedMonth === null || Number(savedMonth) !== currentMonth) {
      remainingGrace = GRACE_LIMIT_MINUTES;
      localStorage.setItem("graceMonth", currentMonth);
    }


    const TOTAL_PERMISSION_MINUTES = 120;

    const [permissionRemaining, setPermissionRemaining] = useState(TOTAL_PERMISSION_MINUTES);
    const [permissionOpen, setPermissionOpen] = useState(false);

    const [permissionForm, setPermissionForm] = useState({
      date: "",
      duration: "",
      reason: ""
    });


    useEffect(() => {
      const currentMonth = new Date().getMonth();
      const savedMonth = localStorage.getItem("permissionMonth");

      if (savedMonth === null || Number(savedMonth) !== currentMonth) {
        setPermissionRemaining(TOTAL_PERMISSION_MINUTES);
        localStorage.setItem("permissionMonth", currentMonth);
      }
    }, []);

    const handlePermissionSubmit = () => {
      const duration = Number(permissionForm.duration);

      if (!permissionForm.date || !duration || !permissionForm.reason) return;
      if (duration > permissionRemaining) return;

      dispatch(
        addPermissionRow({
          attendancedate: permissionForm.date,
          login: "-",
          breakminutes: "-",
          lunchminutes: "-",
          logout: "-",
          totalhours: "-",
          permission: `${duration}m - ${permissionForm.reason}`,
        })
      );

      setPermissionRemaining((prev) => prev - duration);

      setPermissionForm({ date: "", duration: "", reason: "" });
      setPermissionOpen(false);
    };

    const PERMISSION_OPTIONS = [30, 60, 90, 120];



 return (
        <div
            style={{
                minHeight: "100vh",
                width: "100%",
                padding: "120px 40px 20px 40px",
                boxSizing: "border-box",
            }}
        >
            <Header title="MY ATTENDANCE"/>

            <AgGridReact
                // key={gridKey}
                rowData={rowData}
                columnDefs={columDefs}
                defaultColDef={defaultColDef}
                domLayout="autoHeight"
                pagination={true}
                paginationPageSize={10}
                paginationPageSizeSelector={[10,25,50]}
                onGridReady={(params) => {
                    params.api.sizeColumnsToFit()
                }}
            />

            <Box
            sx={{
                display: "flex",
                gap: 3,
                justifyContent: "space-between",
                mt: 3,
            }}
            >
            
            <Card
                sx={{
                flex: 1,
                textAlign: "center",
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "none",
                }}
            >
                <CardContent>
                <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
                    Break Time
                </Typography>

            <Typography sx={{ fontSize: 22, fontWeight: "bold", mt: 1 }}>
            {remainingBreakMinutes} mins
            </Typography>



                </CardContent>
            </Card>

            <Card
                sx={{
                flex: 1,
                textAlign: "center",
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "none",
                }}
            >
                <CardContent>
                <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
                    Grace Time
                </Typography>
            <Typography sx={{ fontSize: 22, fontWeight: "bold" }}>
            {remainingGrace} mins
            </Typography>
            {isAbsent && (
            <Card sx={{ mt: 2, backgroundColor: "#ffebee" }}>
                <CardContent>
                <Typography color="error" fontWeight="bold">
                    You will be absent today !
                </Typography>
                </CardContent>
            </Card>
            )}

                </CardContent>
            </Card>

            {/* -------- Permission Hours -------- */}
            <Card
                sx={{
                flex: 1,
                textAlign: "center",
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "none",
                }}
            >
                <CardContent>
                <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
                    Permission Hours
                </Typography>

                
                <Typography sx={{ fontSize: 22, fontWeight: "bold", mt: 1 }}>
                {permissionRemaining} mins
                </Typography>

                <Button
                variant="contained"
                size="small"
                sx={{ mt: 2 }}
                onClick={() => setPermissionOpen(true)}
                disabled={permissionRemaining === 0}
                >
                Apply
                </Button>
                </CardContent>
            </Card>
            </Box>
            <Dialog open={permissionOpen} onClose={() => setPermissionOpen(false)}>
            <DialogTitle>Apply Permission</DialogTitle>

            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 ,}}>
                <TextField
                type="date"
                label="Date"
                margin='dense'
                InputLabelProps={{ shrink: true }}
                value={permissionForm.date}
                onChange={(e) =>
                    setPermissionForm({ ...permissionForm, date: e.target.value })
                }
                />

              <Select
                  value={permissionForm.duration}
                  displayEmpty
                  onChange={(e) =>
                    setPermissionForm({ ...permissionForm, duration: e.target.value })
                  }
                >
                  <MenuItem value="" disabled>
                    Select Duration
                  </MenuItem>

                  {PERMISSION_OPTIONS.map((min) => (
                    <MenuItem
                      key={min}
                      value={min}
                      disabled={min > permissionRemaining}
                    >
                      {min} mins
                    </MenuItem>
                  ))}
                </Select>


                <TextField
                label="Reason"
                value={permissionForm.reason}
                onChange={(e) =>
                    setPermissionForm({ ...permissionForm, reason: e.target.value })
                }
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={() => setPermissionOpen(false)}>Cancel</Button>
                <Button variant="contained" onClick={handlePermissionSubmit}>
                Submit
                </Button>
            </DialogActions>
            </Dialog>
        </div>
    )
}

export default EachEmployeeTimeTracker