import React, { useState } from "react";
import api from "../api/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  InputAdornment,
  Button,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useGoogleLogin } from "@react-oauth/google";
import "../App.css";
import GoogleLogo from "../asset/google-icon.webp";
import FormBg from "../asset/navy-bg.jpg";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .post("/auth/signup", { username, email, password })

      .then((response) => {
        if (response.data.status) {
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
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

      const backendRes = await api.post("/auth/google-login", {
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
            paddingBottom: "20px",
          }}
        >
          Register
        </Typography>

        <TextField
          type="text"
          placeholder="Username"
          required
          onChange={(e) => setUsername(e.target.value)}
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
