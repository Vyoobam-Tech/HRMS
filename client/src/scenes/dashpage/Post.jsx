import { Card, CardContent, Divider, Typography } from "@mui/material";
import { Box, Grid } from "@mui/system";
import axios from "axios";
import React, { useState, useEffect } from "react";
import Confetti from 'react-confetti';

const Post = () => {

    const [birthdayEmployee, setBirthdayEmployee] = useState([])

    useEffect(() => {
        const fetchAllEmployee = async () => {
            try{
                const response = await axios.get("http://localhost:3000/api/employees/all", {withCredentials: true})
                if(response.data.status){
                    const allEmployee = response.data.data

                    const today = new Date()
                    const todayStr = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth()+1).padStart(2, "0")}-${today.getFullYear()}`

                    const todayBirthday = allEmployee.filter((emp) => {
                        if (!emp.dob) return
                        const dob = new Date(emp.dob)
                        const dobStr = `${String(dob.getDate()).padStart(2, "0")}-${String(dob.getMonth()+1).padStart(2, "0")}-${dob.getFullYear()}`
                        return dobStr === todayStr
                    })
                    setBirthdayEmployee(todayBirthday)
                    }
                }catch(err) {
                    console.log(err)
            }
        }
        fetchAllEmployee()
    }, [])

    return (
        <Box sx={{ mb: 3 }}>
            {birthdayEmployee.map(employee => (
            <Card
                sx={{
                    maxWidth: "100%",
                    borderRadius: 4,
                    boxShadow: 6,
                    overflow: "hidden",
                    position: "relative",
                    mb: 3,
                }}
            >
                <Confetti numberOfPieces={200} />
                <Grid container alignItems="center">
                    <Grid item
                        xs={12}
                        sm={5}
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            p: 2,
                        }}
                    >
                        <Box
                        component="img"
                        src="https://plus.unsplash.com/premium_photo-1692880430494-3bf9cfd56545?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjF8fGJpcnRoZGF5fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600"
                        alt="Birthday"
                        sx={{
                            maxWidth: 300,
                            borderRadius: 3,
                            boxShadow: 3,
                        }}
                    />
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        sm={7}
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <CardContent>
                            <Typography
                            variant="h4"
                            sx={{
                                fontWeight: "bold",
                                color: "#e600b4ff",
                                mb: 1,
                            }}
                            >
                                🎉 Happy Birthday, {""}
                            <Box component="span" sx={{ color: "black" }}>
                                    {employee?.name}
                            </Box>
                            </Typography>
                            <Typography variant="body1" sx={{ color: "#5d4037", mb: 2 }}>
                                Wishing you a wonderful day filled with joy, laughter, and happiness. 🎂
                            </Typography>
                            <Divider sx={{ my: 1, bgcolor: "#ffe0b2" }} />
                            <Typography
                                variant="subtitle2"
                                sx={{ fontStyle: "italic", color: "#8d6e63" }}
                                >
                                    — From the team at Vyoobam Tech
                            </Typography>
                        </CardContent>
                    </Grid>
                </Grid>
            </Card>
            ))}
        </Box>
    )
}

export default Post
