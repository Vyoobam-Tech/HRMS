import React from "react";
import { AppBar, Box, Toolbar, IconButton, Typography } from "@mui/material";
import OAImage from "../image/vyoobam tech.jpeg";
import { useState } from "react";
import { useEffect } from "react";
import axios from 'axios'

const Navbar = ({ isSidebarOpen }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try{
        const res = await axios.get("http://localhost:3000/auth/profile", {
          withCredentials: true
        })
        if(res.data.status){
          setUser(res.data.user)
        }
      } catch (err){
        console.log(err)
      }
    }
    fetchProfile()
  }, [])

  return (
    <Box >
      <AppBar
        position="fixed"
        elevation={-1}
        sx={{
          // zIndex: 1201,
          backgroundColor: "#fff",
          width: isSidebarOpen ? "calc(100% - 265px)" : "calc(100% - 60px)",
          // marginLeft: isSidebarOpen ? "265px" : "60px",
          transition: "margin-left 0.2s ease-in-out",
        }}
      >
        <Toolbar sx={{ display:'flex', justifyContent:'space-between' }}>
          <img 
            src={OAImage}
            style={{ width: 130, height: 110 }}
          />
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{ fontFamily: "Poppins", color: "#34495e"}}
          >
            {user ? `welcome! ${user.username}` : 'Welcome'}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
