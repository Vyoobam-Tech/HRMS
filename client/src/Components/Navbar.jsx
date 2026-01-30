import React from "react";
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, MenuItem, Button, Divider } from "@mui/material";
import OAImage from "../image/vyoobamtech.png";
import { useState } from "react";
import { useEffect } from "react";
import Timer from "./Timer";
import QueryBuilderRoundedIcon from '@mui/icons-material/QueryBuilderRounded';
import { Avatar } from '@mui/material';
import { Link } from "react-router-dom";
import { Stack } from "@mui/system";
import { setLocale } from "yup";
import API from "../api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../features/auth/authSlice";
import { fetchTodayHoliday } from "../features/holidaySlice";
import { fetchLeaveToday } from "../features/leaveSlice";
import { submitAttendance } from "../features/attendanceSlice";

const getTime = () =>
  new Date().toLocaleTimeString("en-GB", { hour12: false });


const Navbar = ({ sidebarWidth }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl)
  const [loginTime, setLoginTime] = useState(null)
  const [breakIn, setBreakIn] = useState(null)
  const [breakOut, setBreakOut] = useState(null)
  const [lunchIn, setLunchIn] = useState(null)
  const [lunchOut, setLunchOut] = useState(null)
  const [totalHours, setTotalHours] = useState(null)

  const dispatch = useDispatch()
  
  const { user, loading: authLoading, error: authError } = useSelector(
    (state) => state.auth)

    const { hasLeaveToday } = useSelector((state) => state.leave);
  const { todayHoliday } = useSelector((state) => state.holiday);
  useEffect(() => {
    dispatch(fetchProfile())
    dispatch(fetchTodayHoliday());
  }, [dispatch])

  useEffect(() => {
    if (user?.empid) {
      dispatch(fetchLeaveToday(user.empid));
    }
  }, [user, dispatch]);

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
        }, [])

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


        const handleClick = async (e) => {
          setAnchorEl(e.currentTarget)

          if(user){
            await fetchLeaveToday(user.empid)
          }
        }

        const handleClose =() => {
          setAnchorEl(null)
        }

    //  if (authLoading) return null;


const handleLogout = async () => {
  if (!user || !loginTime) return;

  const date = new Date().toISOString().split("T")[0];
  const logout = getTime();

  const workedMinutes =
    (new Date(`${date}T${logout}`) -
      new Date(`${date}T${loginTime}`)) / 60000;

  const breakMinutes = calculateMinutes(breakIn, breakOut);
  const lunchMinutes = calculateMinutes(lunchIn, lunchOut);

  const totalMinutes = Math.max(
    0,
    workedMinutes - (breakMinutes + lunchMinutes)
  );

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  try {
    // 🔥 VERY IMPORTANT
    const result = await dispatch(
      submitAttendance({
        empid: user.empid,
        name: user.username,
        attendancedate: date,
        login: loginTime,
        logout,
        breakminutes: breakMinutes,
        lunchminutes: lunchMinutes,
        totalminutes: totalMinutes,
        totalhours: `${hours}h ${minutes}m`,
        status: hours >= 8 ? "Present" : hours >= 4 ? "Half-day" : "Absent",
      })
    ).unwrap(); // 👈 THIS WAITS FOR API SUCCESS

    console.log("Attendance saved:", result);

    // ✅ NOW SAFE
    localStorage.clear();
    window.location.replace("/"); // safer than href
  } catch (err) {
    console.error("Attendance save failed:", err);
    alert("Attendance not saved. Please try again.");
  }
};




  return (
    <Box >
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: "#fff",
        // width: `calc(100% - ${sidebarWidth}px)`,
        // marginLeft: `${sidebarWidth}px`,
        height: "84px",
        transition: "all 0.2s ease-in-out",
      }}
    >

        <Toolbar sx={{ display:'flex', justifyContent:'space-between' }}>
          <img 
            src={OAImage}
            style={{ width: "130px", height: "auto" }}
          />
          <Box display="flex" alignItems="center" gap={3}>
            <Box sx={{ display: "flex", gap: 0.5}}>
            </Box>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <QueryBuilderRoundedIcon sx={{ color: "black" }}/>
              {user && <Timer />}
            </Box>
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{ fontFamily: "Poppins", color: "#34495e"}}
          >
            <IconButton onClick={handleClick}>
              <Avatar />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              sx={{ width: 250 }}
            >
              <MenuItem>
                <Typography >
                  {user ? user.username : 'Welcome'}
                </Typography>
              </MenuItem>
              <MenuItem component={Link} to="/employee-details">View Profile</MenuItem>

              <MenuItem>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={() => {
                    if(hasLeaveToday || todayHoliday) return
                    const time = getTime();
                    localStorage.setItem("loginTime", time);
                    setLoginTime(time);

                  }}
                  disabled={!!loginTime || hasLeaveToday || todayHoliday}
                >
                  LOGIN
                </Button>
              </MenuItem>

              <Divider />
              <MenuItem disableRipple>
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      const time = getTime();
                      localStorage.setItem("breakIn", time);
                      setBreakIn(time);

                    }}
                    disabled={!loginTime || !!breakIn}
                  >
                    Break In
                  </Button>

                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      const time = getTime()
                      localStorage.setItem("breakOut", time)
                      setBreakOut(time)
                    }}
                    disabled={!breakIn || !!breakOut}
                  >
                    Break Out
                  </Button>
                </Stack>
              </MenuItem>

              <MenuItem disableRipple>
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      const time = getTime()
                      localStorage.setItem("lunchIn", time)
                      setLunchIn(time)
                    }}
                    disabled={!breakOut || !!lunchIn}
                  >
                    Lunch In
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      const time =getTime()
                      localStorage.setItem("lunchOut", time)
                      setLunchOut(time)
                    }}
                    disabled={!lunchIn || !!lunchOut }
                  >
                    Lunch Out
                  </Button>
                </Stack>
              </MenuItem>

              <Divider />
              <MenuItem>
                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  onClick={handleLogout}
                  disabled={!loginTime || hasLeaveToday || todayHoliday}
                >
                  Logout
                </Button>
              </MenuItem>
            </Menu>
          </Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
