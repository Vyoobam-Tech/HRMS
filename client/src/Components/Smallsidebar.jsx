import { Box, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse} from "@mui/material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PolylineRoundedIcon from "@mui/icons-material/PolylineRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import HandymanRoundedIcon from "@mui/icons-material/HandymanRounded";
import CelebrationRoundedIcon from "@mui/icons-material/CelebrationRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import PowerSettingsNewRoundedIcon from "@mui/icons-material/PowerSettingsNewRounded";
import AccessibilityRoundedIcon from '@mui/icons-material/AccessibilityRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Smallsidebar = ({ onToggle, setIsAuthenticated }) => {

  const [reportsOpen, setReportsOpen] = useState(false);

    const toggleReportsDropdown = () => {
      setReportsOpen(!reportsOpen);
    };

  const navigate = useNavigate()

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

  return (
    <Box
      sx={{
        position: "fixed",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "60px",
        backgroundColor: "#34495e",
        zIndex: 1000,
        left: 0,
        paddingTop: "20px",
        boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
      }}
    >
      <List sx={{ margin: '-12px'}}>
        <IconButton onClick={onToggle}>
          <MenuIcon sx={{ color: "#fff", marginLeft: "22px", marginBottom: '50px' }}/>
        </IconButton>

      
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
          <ListItemButton component={Link} to="/attandence">
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
            <ListItemText/>
          </ListItemButton>
        </ListItem>

        {/* Dropdown Items */}
        <Collapse in={reportsOpen} timeout="auto" unmountOnExit>
          <List component="div" sx={{ paddingLeft: 2 }}>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/reports?type=attendance">
                <AccessibilityRoundedIcon sx={{ color:'#fff' }}/>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/reports?type=leave">
                <CalendarMonthRoundedIcon sx={{ color: "#fff" }}/>
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>

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
            paddingTop: "60px",
            marginLeft: "22px",
            color: "#fff"
          }}
        >
          <PowerSettingsNewRoundedIcon />
        </IconButton>
      </List>
    </Box>
  );
};

export default Smallsidebar;
