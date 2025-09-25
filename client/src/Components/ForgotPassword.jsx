import React, { useState } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  InputAdornment,
  Button,
  Typography,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import "../App.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post("http://localhost:3000/auth/forgot-password", { email })
      .then((response) => {
        if (response.data.status) {
          alert("Check your email for the reset password link");
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Box className="sign-up-container">
      <form
        className="sign-up-form"
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          width: "400px",
        }}
      >
        <Typography variant="h5" align="center" sx={{ fontFamily: "Poppins" }}>
          Forgot Password
        </Typography>

        <TextField
          type="email"
          placeholder="Email"
          autoComplete="off"
          required
          fullWidth
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
            sx: { paddingTop: "15px", height: "45px" },
          }}
        />

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Send
        </Button>
        <Typography sx={{ fontFamily: "Poppins" }}>
          <Link to="/login" style={{ textDecoration: "none", color: "#1976D2" }}>
            ← back to login
          </Link>
        </Typography>
      </form>
    </Box>
  );
};

export default ForgotPassword;
