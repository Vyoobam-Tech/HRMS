import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import Header from "../../components/Header";
import PowerSettingsNewRoundedIcon from "@mui/icons-material/PowerSettingsNewRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

const Attendance = () => {
  const [login, setLogin] = useState(null);
  const [logout, setLogout] = useState(null);
  const [totalHours, setTotalHours] = useState("0h 0m");

  // activity list
  const [activities, setActivities] = useState([
    { name: "Break", in: null, out: null },
    { name: "Lunch", in: null, out: null },
    { name: "Tea", in: null, out: null },
  ]);

  // dropdown control
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
[], { hour: "2-digit", minute: "2-digit" }
  const getNow = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const calcDuration = (start, end) => {
    if (!start || !end) return 0;
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    return eh * 60 + em - (sh * 60 + sm);
  };

  const handleLogin = () => setLogin(getNow());

  const handleLogout = () => {
    const now = getNow();
    setLogout(now);

    let totalMinutes = 0;

    // sum up all activity durations
    activities.forEach((act) => {
      totalMinutes += calcDuration(act.in, act.out);
    });

    // + work duration before first break
    if (login && now) {
      totalMinutes += calcDuration(login, now);
    }

    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    setTotalHours(`${h}h ${m}m`);
  };

  // open dropdown for activity
  const handleOpenMenu = (event, index) => {
    setAnchorEl(event.currentTarget);
    setSelectedActivity(index);
  };

  // select In/Out for activity
  const handleSelect = (type) => {
    const newActivities = [...activities];
    if (type === "In" && !newActivities[selectedActivity].in) {
      newActivities[selectedActivity].in = getNow();
    }
    if (type === "Out" && !newActivities[selectedActivity].out) {
      newActivities[selectedActivity].out = getNow();
    }
    setActivities(newActivities);
    setAnchorEl(null);
  };

  return (
    <div
      style={{
        height: 500,
        width: "100%",
        marginRight: "60px",
        paddingTop: "100px",
        marginLeft: "30px",
      }}
    >
      <Header title="ATTENDANCE" />

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Login</TableCell>
            <TableCell>Activity</TableCell>
            <TableCell>In Time</TableCell>
            <TableCell>Out Time</TableCell>
            <TableCell>Action</TableCell>
            <TableCell>Total Hours</TableCell>
            <TableCell>Logout</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Login Row */}
          <TableRow>
            <TableCell>
              {login || "-"}
              {!login && (
                <Button
                  variant="contained"
                  startIcon={<PlayArrowRoundedIcon />}
                  onClick={handleLogin}
                  size="small"
                  style={{ marginLeft: "5px" }}
                >
                  Login
                </Button>
              )}
            </TableCell>
            <TableCell colSpan={6}></TableCell>
          </TableRow>

          {/* Activity Rows */}
          {activities.map((act, index) => (
            <TableRow key={index}>
              <TableCell></TableCell>
              <TableCell>{act.name}</TableCell>
              <TableCell>{act.in || "-"}</TableCell>
              <TableCell>{act.out || "-"}</TableCell>
              <TableCell>
                {login && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={(e) => handleOpenMenu(e, index)}
                  >
                    Select
                  </Button>
                )}
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))}

          {/* Total + Logout Row */}
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>{totalHours}</TableCell>
            <TableCell>
              {logout ? (
                logout
              ) : (
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<PowerSettingsNewRoundedIcon />}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          onClick={() => handleSelect("In")}
          disabled={selectedActivity !== null && activities[selectedActivity].in}
        >
          In
        </MenuItem>
        <MenuItem
          onClick={() => handleSelect("Out")}
          disabled={
            selectedActivity !== null && activities[selectedActivity].out
          }
        >
          Out
        </MenuItem>
      </Menu>
    </div>
  );
};

export default Attendance;
