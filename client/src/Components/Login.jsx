import React, { useEffect, useState } from "react";
import API from "../api/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useGoogleLogin } from "@react-oauth/google";
import "../App.css";
import FormBg from "../asset/navy-bg.jpg";
import GoogleLogo from "../asset/google-icon.webp";
import { useDispatch, useSelector } from "react-redux";
import OAImage from "../image/vyoobam tech.jpeg";
import { loginUser } from "../features/auth/authSlice";

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashpage");
    }
  }, [isAuthenticated, navigate])

const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
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
        const loginTime = new Date();
        const loginTimeStr = `${loginTime.getHours().toString().padStart(2,'0')}:${loginTime.getMinutes().toString().padStart(2,'0')}`;
        localStorage.setItem("loginTime", loginTimeStr)

        setIsAuthenticated(true);
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
        <Box
          sx={{
            display:"flex",
            justifyContent: "center"
          }}
        >
          <img
          src={OAImage}
          style={{ width: "130px", height: "auto" }}
          />
        </Box>
        <Typography
          variant="h6"
          align="center"
          sx={{
            color: "#192a56",
            fontWeight: "normal",
            fontFamily: "Poppins",
          }}
        >
          Login to continue
        </Typography>
          {error && (
            <Typography align="center" color="error" sx={{ mt: 1, mb: 1 }}>
              {error}
            </Typography>
          )}
        <TextField
          type="email"
          placeholder="Email"
          autoComplete="off"
          required
          onChange={(e) => setEmail(e.target.value)}
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
          required
          onChange={(e) => setPassword(e.target.value)}
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

        <Link
          to="/forgotPassword"
          style={{
            display: "flex",
            justifyContent: "end",
            textDecoration: "none",
            color: "#1976D2",
          }}
        >
          Forgot Password?
        </Link>

        <Button type="submit" variant="contained" color="primary">
          Login
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
            onClick={login}
          >
            <img
              src={GoogleLogo}
              alt="Google sign-in"
              style={{ width: "30px", height: "30px" }}
            />
          </Box>
        </Box>

        <Typography align="center" sx={{ fontFamily: "Poppins" }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#1976D2" }}>
            Sign Up
          </Link>
        </Typography>
      </form>
    </Box>
  );
};

export default Login;
