import React, { useState } from "react";
import "../App.css";
import Axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Box } from "@mui/system";
import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { token } = useParams();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post("http://localhost:3000/auth/reset-password/" + token, {
      password,
    })
      .then((response) => {
        if (response.data.status) {
          navigate("/login");
        }
        console.log(response.data);
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
        <Typography
          variant="h5"
          align="center"
          sx={{ fontFamily: "Poppins" }}
        >
          Reset Password
        </Typography>

        <TextField
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          required
          fullWidth
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
            sx: { paddingTop: "15px", height: "45px" },
          }}
        />

        <Button type="submit" variant="contained" color="primary">
          Reset
        </Button>
      </form>
    </Box>
  );
};

export default ResetPassword;
