import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import ForgotPassword from "./Components/ForgotPassword";
import ResetPassword from "./Components/ResetPassword";
import Layout from "./Components/Layout";
import Dashpage from "./scenes/dashpage/index";
import Users from "./scenes/form/index";
import Department from "./scenes/department/index";
import Employee from "./scenes/employees/Employees";
import Activities from "./scenes/activities/index";
import AllActivities from "./scenes/activities/AllActivity";
import Holidays from "./scenes/holidays/index";
import Events from "./scenes/events/index";
import Payroll from "./scenes/payroll/index";
import Accounts from "./scenes/accounts/index";
import EachEmployeeTimeTracker from "./scenes/reports/EachEmployeeTimeTracker";
import AllEmployeeTimeTraker from "./scenes/reports/AllEmployeeTimeTraker";
import AttendanceSummary from "./scenes/reports/AttendanceSummary";
import EmpDetails from "./scenes/employees/EmpDetails";
import API from "./api/axiosInstance";
import { Box } from "@mui/material";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn === "true") {
      setIsAuthenticated(true);
    } else {
      API.get("/auth/checkSession")
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

  const handleToggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const role = user?.role;

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/dashpage" /> : <Navigate to="/login" />
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword/:token" element={<ResetPassword />} />

          {/* Protected Routes (after login) */}
          {isAuthenticated && (
            <Route
              path="/"
              element={
                <Layout
                  isSidebarOpen={isSidebarOpen}
                  handleToggleSidebar={handleToggleSidebar}
                  setIsAuthenticated={setIsAuthenticated}
                />
              }
            >
              <Route path="dashpage" element={<Dashpage />} />
              <Route path="department" element={<Department />} />
              <Route path="employee-details" element={<EmpDetails />} />
              <Route path="employee" element={<Employee />} />
              <Route path="activities" element={<Activities />} />
              <Route path="allactivities" element={<AllActivities />} />
              <Route path="holidays" element={<Holidays />} />
              <Route path="events" element={<Events />} />
              <Route path="payroll" element={<Payroll />} />
              <Route path="accounts" element={<Accounts />} />
              <Route path="attendance" element={<EachEmployeeTimeTracker />} />
              <Route path="attendance-report" element={<AllEmployeeTimeTraker />} />
              <Route path="attendance-summary" element={<AttendanceSummary />} />
              {role === "admin" || role === "superadmin" ? (
                <Route path="create-user" element={<Users />} />
              ) : null}
            </Route>
          )}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
