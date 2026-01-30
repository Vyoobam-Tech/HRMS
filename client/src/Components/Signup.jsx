import React, { useState } from "react";
import API from "../api/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  InputAdornment,
  Button,
  Typography,
  IconButton,
  Divider,
  FormGroup,
  FormControl,
  FormControlLabel,
  Radio,
  MenuItem,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import BadgeIcon from '@mui/icons-material/Badge';
import { useGoogleLogin } from "@react-oauth/google";
import AssignmentIcon from "@mui/icons-material/Assignment";
import "../App.css";
import GoogleLogo from "../asset/google-icon.webp";
import FormBg from "../asset/navy-bg.jpg";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../features/auth/authSlice";


const Signup = () => {
  const [username, setUsername] = useState("");
  const [empid, setEmpId] = useState("")
  const [department, setDepartment] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [role, setRole] = useState("employee")
  const [hasSuperAdmin, setHasSuperAdmin] = useState(false);
  const [departments, setDepartments] = useState([])

  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const validate = () => {
  const newErrors = {};

  const empIdPattern = /^[A-Z]{3}\d{4}$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!username.trim()) {
    newErrors.username = "Username is required";
  }

  if (!empid.trim()) {
    newErrors.empid = "Emp ID is required";
  } else if (!empIdPattern.test(empid.toUpperCase())) {
    newErrors.empid =
      "Emp ID must be 3 letters followed by 4 digits (e.g., ABC1234)";
  }

  if (!department) {
    newErrors.department = "Please select a department";
  }

  if (!email.trim()) {
    newErrors.email = "Email is required";
  } else if (!emailPattern.test(email)) {
    newErrors.email = "Invalid email format";
  }

  if (!password) {
    newErrors.password = "Password is required";
  } else if (!passwordPattern.test(password)) {
    newErrors.password =
      "Password must be 8+ chars, include uppercase, lowercase, number, and special character";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  try {
    await dispatch(signupUser({ role, username, empid, department, email, password })).unwrap();
    navigate("/login");
  } catch (err) {
    console.error("Signup failed:", err);
  }
};



  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      const accessToken = tokenResponse.access_token;

      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const profile = await res.json();
      const { email, name, picture } = profile;

      const backendRes = await API.post("/auth/google-login", {
        email,
        name,
        picture,
      });

      if (backendRes.data.status) {
        localStorage.setItem("isLoggedIn", "true");
        navigate("/dashpage");
      }
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => console.log("Google login failed"),
    flow: "implicit",
  });

  const handleRoleChange = (e) => {
    setRole(e.target.value)
  }

  useEffect(() => {
  const checkSuperAdmin = async () => {
    try {
      const res = await API.get("/auth/has-superadmin");
      setHasSuperAdmin(res.data.hasSuperAdmin);
    } catch (err) {
      console.error("Error checking super admin:", err);
    }
  };

  checkSuperAdmin();
}, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await API.get("/api/names/all");
        if (res.data.status) {
          setDepartments(
            res.data.data
              .filter(item => item.type === "DEPARTMENT")
              .map(item => item.name)
          );
        }
      } catch (err) {
        console.error("Error fetching department names:", err);
      }
    };

    fetchDepartments()
  }, [])


  return (
    <Box
      sx={{
        backgroundImage: `url(${FormBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      className="sign-up-container"
    >

      <form
        className="sign-up-form"
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          width: "380px",
          borderRadius: "50px",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{
            color: "#192a56",
            fontWeight: "normal",
            fontFamily: "Poppins",
            paddingTop: "12px",
          }}
        >
          Register
        </Typography>

        {error && (
            <Typography align="center" color="error" sx={{ mt: 1, mb: 1 }}>
              {error}
            </Typography>
          )}

        <Box sx={{ display: "flex" }}>
          <FormGroup>
            <FormControlLabel
              control={
                <Radio
                  checked={role === "employee"}
                  value="employee"
                  onChange={handleRoleChange}
                />
              }
              label="Employee"
            />
          </FormGroup>

          <FormGroup>
            <FormControlLabel
              control={
                <Radio
                  checked={role === "admin"}
                  value="admin"
                  onChange={handleRoleChange}
                />
              }
              label="Admin"
            />
          </FormGroup>

           {!hasSuperAdmin && (
            <FormGroup>
              <FormControlLabel
                control={
                  <Radio
                    checked={role === "superadmin"}
                    value="superadmin"
                    onChange={handleRoleChange}
                  />
                }
                label="Super Admin"
              />
            </FormGroup>
          )}
        </Box>

        <TextField
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          error={!!errors.username}
          helperText={errors.username}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon
                  style={{
                    fontSize: "20px",
                    color: "#666",
                    marginBottom: "15px",
                  }}
                />
              </InputAdornment>
            ),
            sx: { paddingTop: "15px", height: "45px", borderRadius: "50px" },
          }}
        />

        <TextField
          type="text"
          placeholder="Emp ID"
          onChange={(e) => setEmpId(e.target.value)}
          error={!!errors.empid}
          helperText={errors.empid}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BadgeIcon
                  style={{
                    fontSize: "20px",
                    color: "#666",
                    marginBottom: "15px",
                  }}
                />
              </InputAdornment>
            ),
            sx: { paddingTop: "15px", height: "45px", borderRadius: "50px" },
          }}
        />

        <TextField
          select
          label="Department"
          onChange={(e) => setDepartment(e.target.value)}
          value={department}
          error={!!errors.department}
          helperText={errors.department}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AssignmentIcon
                  style={{
                    fontSize: "20px",
                    color: "#666",
                  }}
                />
              </InputAdornment>
            ),
            sx: {height: "45px", borderRadius: "50px" },
          }}
        >
          <MenuItem value="admin">Admin</MenuItem>
          {departments.map((dep) => (
            <MenuItem key={dep} value={dep.toLowerCase()}>
              {dep}
            </MenuItem>
          ) )}
        </TextField>

        <TextField
          type="email"
          placeholder="Email"
          autoComplete="off"
          onChange={(e) => setEmail(e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon
                  style={{
                    fontSize: "20px",
                    color: "#666",
                    marginBottom: "15px",
                  }}
                />
              </InputAdornment>
            ),
            sx: { paddingTop: "15px", height: "45px", borderRadius: "50px" },
          }}
        />

        <TextField
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon
                  style={{
                    fontSize: "20px",
                    color: "#666",
                    marginBottom: "15px",
                  }}
                />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  style={{
                    marginBottom: "15px",
                    color: "#666",
                    backgroundColor: "#ffffff",
                  }}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
            sx: { paddingTop: "15px", height: "45px", borderRadius: "50px" },
          }}
        /> 
        <Button type="submit" variant="contained" color="primary" fullWidth>
          REGISTER
        </Button>

        <Divider>or</Divider>

        <Box display="flex" justifyContent="center">
          <Box
            sx={{
              borderRadius: "50%",
              width: "45px",
              height: "45px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => login()}
          >
            <img
              src={GoogleLogo}
              alt="Google sign-in"
              style={{ width: "30px", height: "30px" }}
            />
          </Box>
        </Box>

        <Typography align="center" sx={{ fontFamily: "Poppins" }}>
          Have an Account?{" "}
          <Link to="/login" style={{ color: "#1976D2" }}>
            Login
          </Link>
        </Typography>
      </form>
    </Box>
  );
};

export default Signup;
