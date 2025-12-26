import React, { useEffect, useState } from "react";
import API from "../../api/axiosInstance";
import { Button, Card, CardContent, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import ApplyLeaveForm from "../../Components/ApplyLeaveForm";
import { Box, Grid } from "@mui/system";
import Header from "../../Components/Header";
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import WorkOffIcon from "@mui/icons-material/WorkOff";


const EmployeeHolidays = () => {

  const [open, setOpen] = useState(false)
  const [user, setUser] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState(null);

  const month = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ]

  const currentMonthName = leaveBalance
    ? month[leaveBalance.month - 1]
    : ""

  const currentYear = leaveBalance?.year || ""




  // 1️⃣ Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await API.get("/auth/profile");
        if (response.data.status) {
          setUser(response.data.user);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        if (user.role === "employee") {
          const res = await API.get(`/api/leave/${user.empid}`);
          setLeaveBalance(res.data);
        }

        if (user.role === "superadmin") {
          const res = await API.get("/api/leave/all");
          setLeaveBalance({
            LeaveRequests: Array.isArray(res.data) ? res.data : []
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [user, leaveBalance]);


  const handleAction = async(leaveId, status) => {
    try{
      await API.put(`/api/leave/${leaveId}/action`, {status})

      if (user.role === "superadmin") {
      const res = await API.get("/api/leave/all");
      setLeaveBalance({ LeaveRequests: Array.isArray(res.data) ? res.data : [] });
      }
    } catch(err){
      console.log(err)
    }
  }

  const cards = [
    {
      icon : <EventAvailableIcon fontSize="large"/>,
      title: "Casual Leave (CL)",
      value: leaveBalance?.availableCL ?? 0,
      subtitle: `${currentMonthName} ${currentYear}`
    },
    {
      icon : <MedicalServicesIcon fontSize="large"/>,
      title: "Sick Leave (SL)",
      value: leaveBalance?.availableSL ?? 0,
      subtitle: `${currentYear}`
    },
    {
      icon : <WorkOffIcon fontSize="large"/>,
      title: "Privilege Leave (PL)" ?? 0,
      value: leaveBalance?.availablePL,
      subtitle: `${currentYear}`
    }
  ]


  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        padding: "120px 40px 20px 40px",
        boxSizing: "border-box",
      }}
    >
      {!leaveBalance ? (
        <Typography>Loading...</Typography>
      ) : (
        user?.role === "employee" && (
          <>
          <Header title="LEAVE BALANCE" />
          <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
        sx={{ mb: 2 }}
      >
        Apply Leave
      </Button>
      <ApplyLeaveForm open={open} handleClose={() => setOpen(false)} user={user} leaveBalance={leaveBalance}/>

      <Box display="flex" flexDirection="column">
        <Grid container spacing={2}>
          {cards.map(({icon, title, value, subtitle}) => (
            <Grid item key={title} xs={12} sm={6} md={4} lg={4}>
              <Card
                sx={{
                  height: 145,
                  width: 230,
                  borderRadius: 3,
                  p:2,
                  color: "#34495e",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    display:"flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    height: "100px"
                  }}
                >
                  <Box>{icon}</Box>
                  <Typography variant="h6">{title}</Typography>
                  <Typography variant="h5" fontWeight="bold">{value}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>{subtitle}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
        </>
        )
      )}

<Typography variant="h6" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
  Leave Requests
</Typography>

{leaveBalance?.LeaveRequests?.length === 0 ? (
  <Typography >No leave requests found</Typography>
) : (
  <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
    <Table>
      <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
        <TableRow>
          {user?.role === "superadmin" && (
            <>
              <TableCell align="center"><b>Emp ID</b></TableCell>
              <TableCell align="center"><b>Emp Name</b></TableCell>
            </>
          )}
          <TableCell><b>Leave Type</b></TableCell>
          <TableCell><b>From Date</b></TableCell>
          <TableCell><b>To Date</b></TableCell>
          <TableCell><b>Status</b></TableCell>
          {user?.role === "superadmin" && (
            <TableCell align="center"><b>Action</b></TableCell>
          )}
        </TableRow>
      </TableHead>

      <TableBody>
        {Array.isArray(leaveBalance?.LeaveRequests) &&
          leaveBalance.LeaveRequests.map((lr) => (
          <TableRow key={lr.id} hover>
            {user?.role === "superadmin" && (
              <>
                <TableCell>{lr.empid}</TableCell>
                <TableCell>{lr.User?.username}</TableCell>
              </>
            )}
            <TableCell>{lr.leaveType}</TableCell>
            <TableCell>{lr.fromDate}</TableCell>
            <TableCell>{lr.toDate}</TableCell>

            <TableCell>
              <Chip
                label={lr.status}
                color={
                  lr.status === "Approved"
                    ? "success"
                    : lr.status === "Rejected"
                    ? "error"
                    : "warning"
                }
                size="small"
              />
            </TableCell>

            {user?.role === "superadmin" && (
              <TableCell align="center">
              {lr.status === "Pending" ? (
                <>
                  <Button
                    size="small"
                    color="success"
                    variant="outlined"
                    sx={{ mr: 1 }}
                    onClick={() => handleAction(lr.id, "Approved")}
                  >
                    Approve
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    onClick={() => handleAction(lr.id, "Rejected")}
                  >
                    Reject
                  </Button>
                </>
              ) : (
                "-"
              )}
            </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
)}

    </div>
  );
};

export default EmployeeHolidays;
