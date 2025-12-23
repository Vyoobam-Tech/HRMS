import React, { useEffect, useState } from "react";
import API from "../../api/axiosInstance";
import { Button } from "@mui/material";
import ApplyLeaveForm from "../../Components/ApplyLeaveForm";

const EmployeeHolidays = () => {

  const [open, setOpen] = useState(false)
  const [user, setUser] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState(null);

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

  // 2️⃣ Fetch leave balance AFTER user is available
  useEffect(() => {
    if (!user?.empid) return; // 🔥 VERY IMPORTANT

    const fetchLeaveBalance = async () => {
      try {
        const res = await API.get(`/api/leave/${user.empid}`);
        setLeaveBalance(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLeaveBalance();
  }, [user]);


  if (!leaveBalance) return <p>Loading...</p>;

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        padding: "120px 40px 20px 40px",
        boxSizing: "border-box",
      }}
    >

      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
        sx={{ mb: 2 }}
      >
        Apply Leave
      </Button>
      <ApplyLeaveForm open={open} handleClose={() => setOpen(false)}/>
      <h2>Employee Leave Balance</h2>
      <p>Year: {leaveBalance.year}
        <span>Month : {leaveBalance.month}</span>
      </p>

      <ul>
        <li>CL: {leaveBalance.clTotal} - Used: {leaveBalance.clUsed}</li>
        <li>SL: {leaveBalance.slTotal} - Used: {leaveBalance.slUsed}</li>
        <li>PL: {leaveBalance.plTotal} - Used: {leaveBalance.plUsed}</li>
      </ul>

      <h3>Leave Requests:</h3>
      <ul>
        {leaveBalance.LeaveRequests?.map((lr) => (
          <li key={lr.id}>
            {lr.leaveType} | {lr.fromDate} → {lr.toDate} | {lr.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeHolidays;
