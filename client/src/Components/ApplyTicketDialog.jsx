import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, TextField, Typography } from '@mui/material'
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { raiseTicket } from '../features/ticketSlice';
import { ToastContainer, toast } from "react-toastify";

const ApplyTicketDialog = ({open, handleClose}) => {

  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth);
  // const { loading, success } = useSelector((state) => state.ticket)

  const [error, setError] = useState("")

  const [form, setForm] = useState({
      category: "",
      subject: "",
      description: "",
      priority: "Low",
      status: "Open",
  })

  const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async () => {

      setError("")

      try {
        const payload = {
          empId: user.empid,
          empName: user.username,
          category: form.category,
          subject: form.subject,
          description: form.description,
          priority: form.priority,
        };

        await dispatch(raiseTicket(payload)).unwrap()

        toast.success("Ticket raised successfully");

        setForm({
          category: "",
          subject: "",
          description: "",
          priority: "Medium",
        })

        handleClose();
      } catch (err) {
        const errorMessage =
            err?.message ||
            err ||
            "Failed to raise ticket"
        setError(errorMessage);
        // toast.error(errorMessage || "Failed to raise ticket")
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
            <DialogTitle>Raise Ticket</DialogTitle>
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
                  name="category"
                  label="Category"
                  value={form.category}
                  onChange={handleChange}
                  fullWidth
                  margin="dense"
                  required
                >
                  <MenuItem value="Payroll">Payroll</MenuItem>
                  <MenuItem value="Leave">Leave</MenuItem>
                  <MenuItem value="IT">IT</MenuItem>
                  <MenuItem value="HR">HR</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>

                <TextField
                  name="subject"
                  label="Subject"
                  value={form.subject}
                  onChange={handleChange}
                  fullWidth
                  margin="dense"
                  required
                />

                <TextField
                  name="description"
                  label="Description"
                  value={form.description}
                  onChange={handleChange}
                  fullWidth
                  margin="dense"
                  multiline
                  rows={3}
                  required
                />

                <TextField
                  select
                  name="priority"
                  label="Priority"
                  value={form.priority}
                  onChange={handleChange}
                  fullWidth
                  margin="dense"
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </TextField>
                    </form>
                  </DialogContent>
                  <DialogActions>
                      <Button variant='outlined' color='primary' onClick={handleSubmit}>Raise</Button>
                      <Button variant='outlined' color="error" onClick={handleClose}>Cancel</Button>
                  </DialogActions>
            </Dialog>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
            />
          </div>
  )
}

export default ApplyTicketDialog