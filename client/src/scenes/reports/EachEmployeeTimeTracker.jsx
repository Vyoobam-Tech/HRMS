import { Button, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import PowerSettingsNewRoundedIcon from "@mui/icons-material/PowerSettingsNewRounded";
import { Box, Stack } from '@mui/system';

const EachEmployeeTimeTracker = () => {

    const [user, setUser] = useState(null)
    const [employee, setEmployee] = useState(null)
    const [loginTime, setLoginTime] = useState(null)
    const [breakStatus, setBreakStatus] = useState("")
    const [lunchStatus, setLunchStatus] = useState("")
    const [breakIn, setBreakIn] = useState(null)
    const [breakOut, setBreakOut] = useState(null)
    const [lunchIn, setLunchIn] = useState(null)
    const [lunchOut, setLunchOut] = useState(null)
    const [totalHours, setTotalHours] = useState("0h 0m")


    useEffect(() => {
        const fetchProfile = async () => {
            try{
                const res = await axios.get("http://localhost:3000/auth/profile", {
                    withCredentials: true
                })
                if(res.data.status){
                    setUser(res.data.user)
                }
            } catch(err) {
                console.log(err)
            }
            }
        fetchProfile()
    }, [])

    useEffect(() => {
        const fetchEmployee = async () => {
            if(!user?.email) return
            try{
                const res = await axios.get(`http://localhost:3000/api/employees/by-user/${user.email}`, {
                    withCredentials: true
                })
                if(res.data.status){
                    setEmployee(res.data.data)
                }
            } catch(err) {
                console.log(err)
            }
            }
        fetchEmployee()
    }, [user])

    useEffect(() => {
        const storedLoginTime = localStorage.getItem("loginTime")
        setLoginTime(storedLoginTime)

        const storedBreakIn = localStorage.getItem("breakIn")
        const storedBreakOut = localStorage.getItem("breakOut")
        setBreakIn(storedBreakIn)
        setBreakOut(storedBreakOut)

        const storedLunchIn = localStorage.getItem("lunchIn")
        const storedLunchOut = localStorage.getItem("lunchOut")
        setLunchIn(storedLunchIn)
        setLunchOut(storedLunchOut)

        // setBreakIn("")
        // setBreakOut("")

        // setLunchIn("")
        // setLunchOut("")

        // setBreakStatus("")
        // setLunchStatus("")

    }, [])

    const handleBreakChange = (e) => {
        const value = e.target.value
        setBreakStatus(value)

        if (value === "In") {
            const time = new Date().toLocaleTimeString("en-GB", { hour12: false })
            localStorage.setItem("breakIn", time)
            setBreakIn(time)
        } else if (value === "Out") {
            const time = new Date().toLocaleTimeString("en-GB", { hour12: false })
            localStorage.setItem("breakOut", time)
            setBreakOut(time)
        }
    }

    const handleLunchChange = (e) => {
        const value = e.target.value
        setLunchStatus(value)

        if (value === "In") {
            const time = new Date().toLocaleTimeString("en-GB", { hour12: false })
            localStorage.setItem("lunchIn", time)
            setLunchIn(time)
        } else if (value === "Out") {
            const time = new Date().toLocaleTimeString("en-GB", { hour12: false })
            localStorage.setItem("lunchOut", time)
            setLunchOut(time)
        }
    }

    const calculateMinutes = (inTime, outTime) => {
        if (!inTime || !outTime) return 0

        const today = new Date().toISOString().split("T")[0]

        const inDate = new Date(`${today}T${inTime}`)
        const outDate = new Date(`${today}T${outTime}`)

        const diffs = outDate - inDate
        return Math.floor(diffs / 60000)
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (!loginTime) return

            const nowDate = new Date()

            const today = new Date().toISOString().split("T")[0]
            const loginDate = new Date(`${today}T${loginTime}`)


            const workedMinutes = Math.floor((nowDate - loginDate) / 60000)

            const breakMinutes = calculateMinutes(breakIn, breakOut)
            const lunchMinutes = calculateMinutes(lunchIn, lunchOut)

            const totalMinutes = Math.max(0, workedMinutes - (breakMinutes+lunchMinutes))

            const hours = Math.floor(totalMinutes / 60)
            const minutes = totalMinutes % 60

            setTotalHours(`${hours}h ${minutes}m`)
        }, 1000)

        return () => clearInterval(interval)
    }, [loginTime, breakIn, breakOut, lunchIn, lunchOut])

    // localStorage.removeItem("breakIn")
    // localStorage.removeItem("breakOut")
    // localStorage.removeItem("lunchOut")
    // localStorage.removeItem("lunchIn")
    // localStorage.removeItem("loginTime")

//   const handleLogout = async () => {
//   if (!employee || !user || !loginTime) return;

//   const logoutTime = new Date().toLocaleTimeString("en-GB", { hour12: false });
//   const attendancedate = new Date().toISOString().split("T")[0];

//   const workedMinutes = Math.floor(
//     (new Date(`${attendancedate}T${logoutTime}`) - new Date(`${attendancedate}T${loginTime}`)) / 60000
//   );

//   const breakMinutes = calculateMinutes(breakIn, breakOut);
//   const lunchMinutes = calculateMinutes(lunchIn, lunchOut);

//   const totalMinutes = Math.max(0, workedMinutes - (breakMinutes + lunchMinutes));
//   const hours = Math.floor(totalMinutes / 60);
//   const minutes = totalMinutes % 60;
//   const totalhours = `${hours}h ${minutes}m`;

//   try {
//     await axios.post("http://localhost:3000/api/attendance", {
//       empid: employee.empId,
//       name: user.username,
//       attendancedate,
//       login: loginTime,
//       logout: logoutTime,
//       breakminutes: breakMinutes,
//       lunchminutes: lunchMinutes,
//       totalhours,
//     });

//     // Clear local storage
//     localStorage.removeItem("loginTime");
//     localStorage.removeItem("breakIn");
//     localStorage.removeItem("breakOut");
//     localStorage.removeItem("lunchIn");
//     localStorage.removeItem("lunchOut");

//     // Redirect or reload
//     window.location.href = "/login"; // adjust if your login route is different
//   } catch (err) {
//     console.error("Error submitting attendance:", err);
//     alert("Failed to submit attendance. Try again.");
//   }
// };


    return (
        <div
            style={{
                height: 450,
                width: "100%",
                marginRight: "60px",
                paddingTop: "140px",
                marginLeft: "30px",
            }}
        >
            <Header title="ATTENDANCE"/>
            <Table>
                <TableHead>
                    <TableRow>
                        {/* <TableCell>Emp ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Date</TableCell> */}
                        <TableCell>Login</TableCell>
                        <TableCell>Break</TableCell>
                        <TableCell>Lunch</TableCell>
                        <TableCell>Total Hours</TableCell>
                        <TableCell>Logout</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                        <TableRow>
                                {/* <TableCell>{employee ? employee.empId : "-"}</TableCell>
                                <TableCell>{user ? user.username : "-"}</TableCell>
                                <TableCell>{dt}</TableCell> */}
                            <TableCell>{loginTime ? loginTime : "-"}</TableCell>
                            <TableCell>
                                <Select
                                    value={breakStatus}
                                    onChange={handleBreakChange}
                                    displayEmpty
                                >
                                    <MenuItem value="">Select</MenuItem>
                                    <MenuItem value="In" disabled={!!breakIn}>In</MenuItem>
                                    <MenuItem value="Out" disabled={!!breakOut}>Out</MenuItem>
                                </Select><br />
                                In : {breakIn || "-"}<br />
                                Out : {breakOut || "-"}<br />
                                Duration: {calculateMinutes(breakIn, breakOut)} min
                            </TableCell>
                            <TableCell>
                                <Select
                                    value={lunchStatus}
                                    onChange={handleLunchChange}
                                    displayEmpty
                                >
                                    <MenuItem value="">Select</MenuItem>
                                    <MenuItem value="In" disabled={!!lunchIn}>In</MenuItem>
                                    <MenuItem value="Out" disabled={!!lunchOut}>Out</MenuItem>
                                </Select><br />
                                In : {lunchIn || "-"}<br />
                                Out : {lunchOut || "-"}<br />
                                Duration: {calculateMinutes(lunchIn, lunchOut)} min
                            </TableCell>
                            <TableCell>{totalHours}</TableCell>
                            <TableCell>
                                <Button variant='contained'  color='error'>
                                    <PowerSettingsNewRoundedIcon />
                                </Button>
                            </TableCell>
                        </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}

export default EachEmployeeTimeTracker