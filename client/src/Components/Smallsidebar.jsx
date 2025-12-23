import { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Collapse,
} from "@mui/material";
import {
  DashboardRounded as DashboardRoundedIcon,
  PolylineRounded as PolylineRoundedIcon,
  BadgeRounded as BadgeRoundedIcon,
  HandymanRounded as HandymanRoundedIcon,
  CelebrationRounded as CelebrationRoundedIcon,
  EmojiEventsRounded as EmojiEventsRoundedIcon,
  PaymentOutlined as PaymentOutlinedIcon,
  AccountBalanceRounded as AccountBalanceRoundedIcon,
  AssessmentRounded as AssessmentRoundedIcon,
  ExpandLess,
  ExpandMore,
  Menu as MenuIcon,
  PowerSettingsNewRounded as PowerSettingsNewRoundedIcon,
} from "@mui/icons-material";
import AccessibilityRoundedIcon from "@mui/icons-material/AccessibilityRounded";
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";

const Smallsidebar = ({ onToggle, setIsAuthenticated }) => {
  const SMALL_SIDEBAR_WIDTH = 80;
  const [reportsOpen, setReportsOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const toggleReportsDropdown = () => setReportsOpen(!reportsOpen);

  const handleLogout = async () => {
    try {
      await API.get("/auth/logout");
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
        const response = await API.get("/auth/profile")
        if (response.data.status) setUser(response.data.user)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    };
    fetchUser()
  }, [])

  const role = user?.role

  if (loading) return null

  return (
    <Box
       sx={{
        width: `${SMALL_SIDEBAR_WIDTH}px`,
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        backgroundColor: "#34495e",
        zIndex: 1200,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        paddingTop: "20px",
        boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
      }}
    >
      <List sx={{
        margin: "-12px",
        padding: 0 ,
        "& .MuiListItem-root": {
          paddingY: "3px",
        },}}
      >
        <IconButton onClick={onToggle}>
          <MenuIcon sx={{ color: "#fff", marginLeft: "22px", marginBottom: "30px" }} />
        </IconButton>


        {role === "employee" && (
          <>
            <ListItem>
              <ListItemButton component={Link} to="/dashpage">
                <ListItemIcon>
                  <DashboardRoundedIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>

            <ListItem>
              <ListItemButton component={Link} to="/department">
                <ListItemIcon>
                  <PolylineRoundedIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>

            <ListItem>
              <ListItemButton component={Link} to="/employee-details">
                <ListItemIcon>
                  <BadgeRoundedIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>

            <ListItem>
              <ListItemButton component={Link} to="/attendance">
                <ListItemIcon>
                  <DateRangeIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>

            <ListItem>
              <ListItemButton component={Link} to="/activities">
                <ListItemIcon>
                  <HandymanRoundedIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>

            <ListItem>
              <ListItemButton component={Link} to="/holidays">
                <ListItemIcon>
                  <CelebrationRoundedIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>

            <ListItem>
              <ListItemButton component={Link} to="/emp-holidays">
                <ListItemIcon>
                  <HolidayVillageIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>

            <ListItem>
              <ListItemButton component={Link} to="/events">
                <ListItemIcon>
                  <EmojiEventsRoundedIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          </>
        )}


        {(role === "admin" || role === "superadmin") && (
          <>
            <ListItem>
              <ListItemButton component={Link} to="/dashpage">
                <ListItemIcon>
                  <DashboardRoundedIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>

            <ListItem>
              <ListItemButton component={Link} to="/department">
                <ListItemIcon>
                  <PolylineRoundedIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>

            <ListItem>
              <ListItemButton component={Link} to="/employee">
                <ListItemIcon>
                  <BadgeRoundedIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>

            <ListItem>
              <ListItemButton component={Link} to="/allactivities">
                <ListItemIcon>
                  <HandymanRoundedIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>

            <ListItem>
              <ListItemButton component={Link} to="/holidays">
                <ListItemIcon>
                  <CelebrationRoundedIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>

            <ListItem>
              <ListItemButton component={Link} to="/events">
                <ListItemIcon>
                  <EmojiEventsRoundedIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>

            <ListItem>
              <ListItemButton component={Link} to="/payroll">
                <ListItemIcon>
                  <PaymentOutlinedIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>

            <ListItem>
              <ListItemButton component={Link} to="/accounts">
                <ListItemIcon>
                  <AccountBalanceRoundedIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>

            {/* Reports Dropdown */}
            <ListItem>
              <ListItemButton onClick={toggleReportsDropdown}>
                <ListItemIcon>
                  <AssessmentRoundedIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
                {reportsOpen ? <ExpandLess sx={{ color: "#fff" }} /> : <ExpandMore sx={{ color: "#fff" }} />}
              </ListItemButton>
            </ListItem>

            <Collapse in={reportsOpen} timeout="auto" unmountOnExit>
              <List component="div" sx={{ paddingLeft: 2 }}>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="attendance-report">
                    <AccessibilityRoundedIcon sx={{ color: "#fff" }} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="attendance-summary">
                    <CalendarMonthRoundedIcon sx={{ color: "#fff" }} />
                  </ListItemButton>
                </ListItem>
              </List>
            </Collapse>
          </>
        )}

        <IconButton
          size="large"
          edge="end"
          color="inherit"
          onClick={handleLogout}
          sx={{
            "&:hover": { backgroundColor: "transparent", boxShadow: "none" },
            paddingTop: "60px",
            marginLeft: "22px",
            color: "#fff",
          }}
        >
          <PowerSettingsNewRoundedIcon />
        </IconButton>
      </List>
    </Box>
  );
};

export default Smallsidebar;
