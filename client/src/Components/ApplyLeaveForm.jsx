import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, TextField, Typography } from '@mui/material'
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState } from 'react'
import API from '../api/axiosInstance';

const ApplyLeaveForm = ({open, handleClose, user, leaveBalance}) => {

    const [form, setForm] = useState({
        leaveType : "CL",
        fromDate : "",
        toDate: "",
        days: 0
    })
    const [error, setError] = useState("")

    useEffect(() => {
        if(form.fromDate && form.toDate){
            const from = new Date(form.fromDate)
            const to = new Date(form.toDate)

            const diff = Math.ceil((to - from)/ (1000 * 60 * 60 * 24)) + 1

            setForm(prev => ({
                ...prev,
                days: diff > 0 ? diff : 0
            }))
        }
    }, [form.fromDate,form.toDate])

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async () => {
        try{
            setError("")

            if (!user?.empid) {
            setError("Employee ID not found. Please login again.")
            return
        }

            await API.post("/api/leave/apply", {
                empid: user.empid,
                ...form
            })

            setForm({
                leaveType: "CL",
                fromDate: "",
                toDate: "",
                days: 0
            })

            handleClose()
        } catch(err){
            console.log(err)

            if(err.response && err.response.data?.message){
                setError(err.response.data.message)
            }else{
                setError("something went wrong")
            }
        }
    }
  return (
    <div>
        <Dialog open={open} onClose={handleClose}>
            <div
                className="modal-header"
                style={{
                background: "#1976D2",
                color: "white",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px",
                borderBottom: "1px solid #ddd",
            }}
            >
            <DialogTitle>Apply Leave</DialogTitle>
            <IconButton  onClick={handleClose}>
                <CloseIcon sx={{ color: "white" }}/>
            </IconButton>
            </div>
            {error && (
                <Typography align="center" color="error" sx={{ mt: 1, mb: 1 }}>
                    {error}
                </Typography>
            )}
            <DialogContent>
                <form>
                    <TextField
                        select
                        name='leaveType'
                        label="Leave Type"
                        value={form.leaveType}
                        onChange={handleChange}
                        fullWidth
                        margin='dense'
                    >
                        <MenuItem value='CL' disabled={!leaveBalance || leaveBalance.availableCL === 0}>CL</MenuItem>
                        <MenuItem value='SL'>SL</MenuItem>
                        <MenuItem value='PL'>PL</MenuItem>
                    </TextField>

                    <TextField
                        name='fromDate'
                        label="From Date"
                        type="date"
                        value={form.fromDate}
                        onChange={handleChange}
                        fullWidth
                        margin='dense'
                        InputLabelProps={{ shrink: true }}
                        required
                    />

                    <TextField
                        name='toDate'
                        label="To Date"
                        type="date"
                        value={form.toDate}
                        onChange={handleChange}
                        fullWidth
                        margin='dense'
                        InputLabelProps={{ shrink: true }}
                        required
                    />

                    <TextField
                        label="Days"
                        type="number"
                        value={form.days}
                        fullWidth
                        margin='dense'

                    />
                </form>
            </DialogContent>
                    <DialogActions>
                        <Button variant='outlined' color='primary' onClick={handleSubmit}>Apply</Button>
                        <Button onClick={handleClose} variant='outlined' color="error">Cancel</Button>
                    </DialogActions>
        </Dialog>
    </div>
    )
}

export default ApplyLeaveForm