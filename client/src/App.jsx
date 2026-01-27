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
import Policy from "./scenes/policy/index";
import Events from "./scenes/events/index";
import Payroll from "./scenes/payroll/index";
import Accounts from "./scenes/accounts/index";
import Tickets from "./scenes/tickets/index";
import EachEmployeeTimeTracker from "./scenes/reports/EachEmployeeTimeTracker";
import AllEmployeeTimeTraker from "./scenes/reports/AllEmployeeTimeTraker";
import AttendanceSummary from "./scenes/reports/AttendanceSummary";
import EmpDetails from "./scenes/employees/EmpDetails";
import API from "./api/axiosInstance";
import { Box } from "@mui/material";
import EmployeeHolidays from "./scenes/holidays/EmployeeHolidays";
import AddingNames from "./scenes/manageButton/index"
import { fetchProfile } from "./features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
 
function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const dispatch = useDispatch();

  const { user, loading: authLoading, error: authError } = useSelector(
    (state) => state.auth
    )

  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(fetchProfile());
    }
  }, [dispatch]);


  // Dead code removed



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
          <Route path="/login" element={<Login />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />


          {/* Protected Routes (after login) */}
          {isAuthenticated && (
            <Route
              path="/"
              element={
                <Layout
                  isSidebarOpen={isSidebarOpen}
                  handleToggleSidebar={handleToggleSidebar}
                  // setIsAuthenticated={setIsAuthenticated}
                />
              }
            >
              <Route path="dashpage" element={<Dashpage />} />
              {/* <Route path="department" element={<Department />} /> */}
              <Route path="employee-details" element={<EmpDetails />} />
              {/* <Route path="employee" element={<Employee />} /> */}
              <Route path="activities" element={<Activities />} />
              {/* <Route path="allactivities" element={<AllActivities />} /> */}
              <Route path="holidays" element={<Holidays />} />
              <Route path="policy" element={<Policy />} />
              <Route path="emp-holidays" element={
                user? (<EmployeeHolidays empId={user.empId}/> ) : (<p>Loading...</p>)} />
              <Route path="events" element={<Events />} />
              {/* <Route path="payroll" element={<Payroll />} />
              <Route path="accounts" element={<Accounts />} /> */}
              <Route path="attendance" element={<EachEmployeeTimeTracker />} />
              {/* <Route path="attendance-report" element={<AllEmployeeTimeTraker />} />
              <Route path="attendance-summary" element={<AttendanceSummary />} />
              <Route path="adding-names" element={<AddingNames />} /> */}
              <Route path="tickets" element={<Tickets />} />
              {role === "admin" || role === "superadmin" ? (
                <>
                  <Route path="department" element={<Department />} />
                  <Route path="create-user" element={<Users />} />
                  <Route path="employee" element={<Employee />} />
                  <Route path="allactivities" element={<AllActivities />} />
                  <Route path="payroll" element={<Payroll />} />
                  <Route path="accounts" element={<Accounts />} />
                  <Route path="attendance-report" element={<AllEmployeeTimeTraker />} />
                  <Route path="attendance-summary" element={<AttendanceSummary />} />
                  <Route path="adding-names" element={<AddingNames />} />
                </>
              ) : null}
            </Route>
          )}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
