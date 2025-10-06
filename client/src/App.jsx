import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Box } from "@mui/material";
import axios from "axios";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import ForgotPassword from "./Components/ForgotPassword";
import ResetPassword from "./Components/ResetPassword";
import Dashpage from "./scenes/dashpage/index";
import Sidebar from "./Components/Sidebar";
import SmallSidebar from "./Components/Smallsidebar";
import Users from "./scenes/form/index";
import Department from "./scenes/department/index";
import Employee from "./scenes/employees/index";
import Activities from "./scenes/activities/index";
import Holidays from "./scenes/holidays/index";
import Events from "./scenes/events/index";
import Payroll from "./scenes/payroll/index";
import Accounts from "./scenes/accounts/index";
import Reports from "./scenes/reports/index";
import Navbar from "./Components/Navbar";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import EachEmployeeTimeTracker from "./scenes/reports/EachEmployeeTimeTracker";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");

    if (loggedIn === "true") {
      setIsAuthenticated(true);
    } else {
      axios
        .get("http://localhost:3000/auth/checkSession", {withCredentials: true})
        .then((response) => {
          if (response.data.loggedIn) {
            setIsAuthenticated(true);
            localStorage.setItem("isLoggedIn", "true");
          } else {
            setIsAuthenticated(false);
            localStorage.removeItem("isLoggedIn");
          }
        })
        .catch(() => {
          setIsAuthenticated(false);
          localStorage.removeItem("isLoggedIn");
        });
    }
  }, []);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashpage" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword/:token" element={<ResetPassword />} />

          {isAuthenticated && (
            <Route
              path="/*"
              element={
                <Box display="flex">
                  {isSidebarOpen ? (
                    <Sidebar onToggle={handleToggleSidebar}
                      setIsAuthenticated={setIsAuthenticated}
                    />
                  ) : (
                    <SmallSidebar onToggle={handleToggleSidebar}
                      setIsAuthenticated={setIsAuthenticated}
                  />
                  )}
                  <Box flex={1} display="flex" flexDirection="column">
                    <Navbar isSidebarOpen={isSidebarOpen} />
                    <Box
                      flex={1}
                      p={5}
                      sx={{
                        marginLeft: isSidebarOpen ? "220px" : "60px",
                        transition: "margin-left 0.2s ease-in-out",
                      }}
                    >
                      <Routes>
                        <Route path="/dashpage" element={<Dashpage />} />
                        <Route path="/create-user" element={<Users />} />
                        <Route path="/department" element={<Department />} />
                        <Route path="/employee" element={<Employee />} />
                        <Route path="/attandence" element={<EachEmployeeTimeTracker />} />
                        <Route path="/activities" element={<Activities />} />
                        <Route path="/holidays" element={<Holidays />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/payroll" element={<Payroll />} />
                        <Route path="/accounts" element={<Accounts />} />
                        <Route path="/reports" element={<Reports />} />
                      </Routes>
                    </Box>
                  </Box>
                </Box>
              }
            />
          )}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
