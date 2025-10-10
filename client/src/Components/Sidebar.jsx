import { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Collapse,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import PolylineRoundedIcon from "@mui/icons-material/PolylineRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import HandymanRoundedIcon from "@mui/icons-material/HandymanRounded";
import CelebrationRoundedIcon from "@mui/icons-material/CelebrationRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import BusinessCenterRoundedIcon from "@mui/icons-material/BusinessCenterRounded";
import LockPersonRoundedIcon from "@mui/icons-material/LockPersonRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DateRangeIcon from '@mui/icons-material/DateRange';
import PowerSettingsNewRoundedIcon from "@mui/icons-material/PowerSettingsNewRounded";
import { Link, Router, Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Sidebar = ({ onToggle, setIsAuthenticated }) => {
  const [reportsOpen, setReportsOpen] = useState(false);
  const [user, setUser] = useState(null)
  const navigate = useNavigate();

  const toggleReportsDropdown = () => {
    setReportsOpen(!reportsOpen);
  };

  const handleLogout = async () => {
    try{
      await axios.get("http://localhost:3000/auth/logout", {withCredentials: true})

      localStorage.removeItem("isLoggedIn")
      setIsAuthenticated(false)
      navigate("/login")
    } catch(err) {
      console.log(err)
    }
  }

  useEffect(() => {
      const fetchUser = async () => {
        try{
          const response = await axios.get("http://localhost:3000/auth/profile", {withCredentials: true})
          if(response.data.status){
            setUser(response.data.user)
          }
        } catch(err) {
          console.log(err)
        }
      }
      fetchUser()
    }, [])

    const role = user?.role

  return (
    <Box
      sx={{
        width: "29vh",
        backgroundColor: "#34495e",
        color: "#fff",
        height: "100vh",
        boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
        paddingTop: "30px",
        paddingLeft: "30px",
        position: "fixed",
        left: 0,
        overflowY: "auto",
      }}
    >
      <IconButton
        onClick={onToggle}
        sx={{ marginTop: "-15px", marginLeft: "-20px", marginBottom:'50px', color: "#fff" }}
      >
        <ArrowBackIcon />
      </IconButton>

      {/* <Typography
        variant="h5"
        sx={{
          fontFamily: "Poppins",
          paddingTop: "10px",
          paddingBottom: "35px",
          paddingLeft: "30px",
          fontWeight: "bold",
          color: "#fff",
        }}
      >
        Tamilmani
      </Typography> */}
      {role === "employee" && (
        <List>
          <ListItem disablePadding>
          <ListItemButton component={Link} to="/dashpage">
            <ListItemIcon>
              <DashboardRoundedIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Dashpage" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/department">
            <ListItemIcon>
              <PolylineRoundedIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Department" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/employee-details">
            <ListItemIcon>
              <PolylineRoundedIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="My Details" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/attandence">
            <ListItemIcon>
              <DateRangeIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Attendance" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/activities">
            <ListItemIcon>
              <HandymanRoundedIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Activities" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/holidays">
            <ListItemIcon>
              <CelebrationRoundedIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Holidays" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/events">
            <ListItemIcon>
              <EmojiEventsRoundedIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Events" />
          </ListItemButton>
        </ListItem>
        </List>
      )}

    {(role === "admin" || role === "superadmin")  && (
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/dashpage">
            <ListItemIcon>
              <DashboardRoundedIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Dashpage" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/department">
            <ListItemIcon>
              <PolylineRoundedIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Department" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/employee-details">
            <ListItemIcon>
              <PolylineRoundedIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="My Details" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/employee">
            <ListItemIcon>
              <BadgeRoundedIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Employees" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/attandence">
            <ListItemIcon>
              <DateRangeIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Attendance" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/activities">
            <ListItemIcon>
              <HandymanRoundedIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Activities" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/holidays">
            <ListItemIcon>
              <CelebrationRoundedIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Holidays" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/events">
            <ListItemIcon>
              <EmojiEventsRoundedIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Events" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/payroll">
            <ListItemIcon>
              <PaymentOutlinedIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Payroll" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/accounts">
            <ListItemIcon>
              <AccountBalanceRoundedIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Accounts" />
          </ListItemButton>
        </ListItem>

        {/* Reports Dropdown */}
        <ListItem disablePadding>
          <ListItemButton onClick={toggleReportsDropdown}>
            <ListItemIcon>
              <AssessmentRoundedIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Reports" />
            {reportsOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        

        {/* Dropdown Items */}
        <Collapse in={reportsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ paddingLeft: 4 }}>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/reports?type=attendance">
                <ListItemText primary="Attendance Report" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/reports?type=leave">
                <ListItemText primary="Leave Report" />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>
        {/* <br />
            <Divider width="200px" />
            <br />
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/projects">
                <ListItemIcon>
                  <AssignmentRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Projects" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton component={Link} to="/jobportal">
                <ListItemIcon>
                  <BusinessCenterRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Job Portal" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton component={Link} to="/auth">
                <ListItemIcon>
                  <LockPersonRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Authentication" />
              </ListItemButton>
            </ListItem> */}
      </List>
     )}

      <IconButton
        size="large"
        edge="end"
        aria-haspopup="true"
        color="inherit"
        onClick={handleLogout}
        sx={{
          "&:hover": {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
          paddingTop: "90px",
          marginLeft: "35px",
        }}
      >
        <PowerSettingsNewRoundedIcon />
        <Typography sx={{ fontFamily: "Poppins", m: "5px" }}>Logout</Typography>
      </IconButton>
    </Box>
  );
};

export default Sidebar;
