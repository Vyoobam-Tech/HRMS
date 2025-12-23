import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, TextField } from '@mui/material'
import CloseIcon from "@mui/icons-material/Close";
import React from 'react'

const ApplyLeaveForm = ({open, handleClose}) => {
  return (
    <div>
        <Dialog open={open} onclose={handleClose}>
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
            <IconButton>
                <CloseIcon sx={{ color: "white" }} onClick={handleClose}/>
            </IconButton>
            </div>
            <DialogContent>
                <form>
                    <TextField
                        select
                        label="Leave Type"
                    >
                        <MenuItem>CL</MenuItem>
                        <MenuItem>SL</MenuItem>
                        <MenuItem>PL</MenuItem>
                    </TextField>

                    <TextField
                        label="From Date"
                        type="date"
                        
                    />

                    <TextField
                        label="To Date"
                        type="date"

                    />

                    <TextField
                        label="Days"
                        type="number"

                    />
                </form>
            </DialogContent>
                    <DialogActions>
                        <Button variant='outlined' color='primary'>Apply</Button>
                        <Button onClick={handleClose} variant='outlined' color="error">Cancel</Button>
                    </DialogActions>
        </Dialog>
    </div>
    )
}

export default ApplyLeaveForm