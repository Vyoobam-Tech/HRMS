import {  Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

const Footer = () => {
  return (
    <Box
        position='static'
        sx={{
            top: "auto",
            bottom: 0,
            background: "#34495e",
        }}
    >
        <Toolbar sx={{ justifyContent: "center"}}>
            <Typography variant='body2' color='white'>
                &copy; {new Date().getFullYear()} Vyoobam Tech. All rights reserved. | Empowering Digital Solutions
            </Typography>
        </Toolbar>
    </Box>
  )
}

export default Footer