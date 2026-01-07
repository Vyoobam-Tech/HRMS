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
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PolicyIcon from '@mui/icons-material/Policy';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PowerSettingsNewRoundedIcon from "@mui/icons-material/PowerSettingsNewRounded";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";

const Sidebar = ({ onToggle, setIsAuthenticated }) => {
  const [reportsOpen, setReportsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const toggleReportsDropdown = () => {
    setReportsOpen(!reportsOpen);
  };

  const handleLogout = async () => {
    try {
      await API.get("/auth/logout", { withCredentials: true });
      localStorage.removeItem("token"); // remove JWT if using token
      localStorage.removeItem("isLoggedIn");
      setIsAuthenticated(false);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Use JWT from localStorage or rely on cookies
        const token = localStorage.getItem("token");
        const response = await API.get("/auth/profile", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true, // important for cookies
        });

        if (response.data.status) {
          setUser(response.data.user);
        } else {
          // If unauthorized, redirect to login
          setIsAuthenticated(false);
          navigate("/login");
        }
      } catch (err) {
        console.log(err);
        setIsAuthenticated(false);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate, setIsAuthenticated]);

  const role = user?.role;

  if (loading) return null;

  return (
    <Box
      sx={{
        width: "260px",
        backgroundColor: "#34495e",
        color: "#fff",
        height: `calc(100vh - 64px)`,
        position: "fixed",
        left: 0,
        top: "84px",
        overflowY: "auto",
        boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
        paddingTop: "30px",
        paddingLeft: "20px",
        transition: "width 0.2s ease-in-out",
        zIndex: 1200,
        "& .MuiListItemText-primary": {
          fontSize: "0.85rem",
        },
      }}
    >
      <IconButton
        onClick={onToggle}
        sx={{ marginTop: "-15px", marginLeft: "-20px", color: "#fff" }}
      >
        <ArrowBackIcon />
      </IconButton>

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
            <ListItemButton component={Link} to="/employee-details">
              <ListItemIcon>
                <BadgeRoundedIcon sx={{ color: "#fff" }} />
              </ListItemIcon>
              <ListItemText primary="My Details" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={Link} to="/attendance">
              <ListItemIcon>
                <DateRangeIcon sx={{ color: "#fff" }} />
              </ListItemIcon>
              <ListItemText primary="My Attendance" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={Link} to="/activities">
              <ListItemIcon>
                <HandymanRoundedIcon sx={{ color: "#fff" }} />
              </ListItemIcon>
              <ListItemText primary="My Activities" />
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
            <ListItemButton component={Link} to="/emp-holidays">
              <ListItemIcon>
                <HolidayVillageIcon sx={{ color: "#fff" }} />
              </ListItemIcon>
              <ListItemText primary="Leave Management" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={Link} to="/policy">
              <ListItemIcon>
                <PolicyIcon sx={{ color: "#fff" }} />
              </ListItemIcon>
              <ListItemText primary="Workplace Ethics" />
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

      {(role === "admin" || role === "superadmin") && (
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
            <ListItemButton component={Link} to="/employee">
              <ListItemIcon>
                <BadgeRoundedIcon sx={{ color: "#fff" }} />
              </ListItemIcon>
              <ListItemText primary="Employees" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={Link} to="/allactivities">
              <ListItemIcon>
                <HandymanRoundedIcon sx={{ color: "#fff" }} />
              </ListItemIcon>
              <ListItemText primary="All Activities" />
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
            <ListItemButton component={Link} to="/emp-holidays">
              <ListItemIcon>
                <HolidayVillageIcon sx={{ color: "#fff" }} />
              </ListItemIcon>
              <ListItemText primary="Leave Management" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={Link} to="/policy">
              <ListItemIcon>
                <PolicyIcon sx={{ color: "#fff" }} />
              </ListItemIcon>
              <ListItemText primary="Workplace Ethics" />
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
                <ListItemButton component={Link} to="attendance-report">
                  <ListItemText primary="Attendance Report" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="attendance-summary">
                  <ListItemText primary="Attendance Summary" />
                </ListItemButton>
              </ListItem>
            </List>
          </Collapse>

          <ListItem disablePadding>
            <ListItemButton component={Link} to="/adding-names">
              <ListItemIcon>
                <ManageAccountsIcon sx={{ color: "#fff" }} />
              </ListItemIcon>
              <ListItemText primary="Manage" />
            </ListItemButton>
          </ListItem>
        </List>
      )}

      <IconButton
        size="large"
        edge="end"
        aria-haspopup="true"
        color="inherit"
        onClick={handleLogout}
        sx={{
          "&:hover": { backgroundColor: "transparent", boxShadow: "none" },
          // paddingTop: "20px",
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
