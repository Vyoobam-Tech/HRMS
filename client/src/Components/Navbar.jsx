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

const Navbar = ({ sidebarWidth }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl)
  const [user, setUser] = useState(null)
  const [loginTime, setLoginTime] = useState(null)
  const [breakIn, setBreakIn] = useState(null)
  const [breakOut, setBreakOut] = useState(null)
  const [lunchIn, setLunchIn] = useState(null)
  const [lunchOut, setLunchOut] = useState(null)
  const [totalHours, setTotalHours] = useState(null)
  const [hasLeaveToday, setHasLeaveToday] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try{
        const res = await API.get("/auth/profile")
          if(res.data.status){
            setUser(res.data.user)
          }
      } catch (err){
        console.log(err)
      }
    }
    fetchProfile()
  }, [])


    const fetchLeaveToday = async () => {
      try{
        const res = await API.get(`/api/leave/today/${user.empid}`)
        setHasLeaveToday(res.data.hasLeave)
      }catch(err){
        console.log(err)
      }
    }

    useEffect(() => {
      if(user){
        fetchLeaveToday(user.empid)
      }
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

      const handleLogout = async () => {
        if (!user || !loginTime) return;

        const logoutTime = new Date().toLocaleTimeString("en-GB", { hour12: false });
        const attendancedate = new Date().toISOString().split("T")[0];

        const logoutDate = new Date(`${attendancedate}T${logoutTime}`)
        const loginDate = new Date(`${attendancedate}T${loginTime}`)

        const workedMinutes = Math.floor((logoutDate - loginDate) / 60000)

        const breakMinutes = calculateMinutes(breakIn, breakOut)
        const lunchMinutes = calculateMinutes(lunchIn, lunchOut);

        const totalMinutes = Math.max(0, workedMinutes - (breakMinutes + lunchMinutes));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const totalhours = `${hours}h ${minutes}m`;
        console.log(totalMinutes)

        const remaining = 8 - hours

        let status = ""

        if(hours >= 8){
          status = "Present"
        } else if(hours >= 6 && hours < 8){
          const confirm = window.confirm(`You have worked ${hours.toFixed(1)} hrs.\n${remaining} hrs remaining to complete 8 hrs.\nDo you want to logout?`)
          if(confirm){
            status = "Half-day"
          }else{
            return
          }
        } else if(hours >= 4 && hours < 6){
          status = "Half-day"
        }else{
          status = "Absent"
        }

        try {
          await API.post("/api/attendance", {
            empid: user.empid,
            name: user.username,
            attendancedate,
            login: loginTime,
            logout: logoutTime,
            breakminutes: `${breakMinutes}m`,
            lunchminutes: `${lunchMinutes}m`,
            totalMinutes,
            totalhours,
            status
          });


          localStorage.removeItem("loginTime")
          localStorage.removeItem("breakIn")
          localStorage.removeItem("breakOut")
          localStorage.removeItem("lunchIn")
          localStorage.removeItem("lunchOut")

          window.location.href = "/"
        } catch (err) {
          console.error("Error submitting attendance:", err)
          alert("Failed to submit attendance. Try again.")
        }
    }

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
                    if(hasLeaveToday) return
                    const time = new Date().toLocaleTimeString("en-GB", { hour12: false})
                    localStorage.setItem("loginTime", time)
                    setLoginTime(time)
                  }}
                  disabled={!!loginTime || hasLeaveToday}
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
                      const time = new Date().toLocaleTimeString("en-GB", { hour12: false })
                      localStorage.setItem("breakIn", time)
                      setBreakIn(time)
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
                      const time = new Date().toLocaleTimeString("en-GB", { hour12: false })
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
                      const time = new Date().toLocaleTimeString("en-GB", { hour12: false})
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
                      const time = new Date().toLocaleTimeString("en-GB", { hour12: false})
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
