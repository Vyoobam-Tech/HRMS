import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllEmployees } from '../features/employeeSlice';
import { assignTask } from '../features/taskSlice';
import { ToastContainer, toast } from "react-toastify";


const AssignTaskDialog = ({open, handleClose}) => {

    const [form, setForm] = useState({
        empId: "",
        taskTitle: "",
        description: "",
        dueDate: "",
        priority: "Medium"
    })
    const [error, setError] = useState("")

    const dispatch = useDispatch()

    const { all: employees } = useSelector((state) => state.employee)
    const { user } = useSelector((state) => state.auth)

    useEffect(() => {
        if(open) {
            dispatch(fetchAllEmployees())
        }
    }, [open, dispatch])

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async () => {
        if (!user) {
            setError("User not logged in");
        return;
        }

    try {
        setError("")
        const payload = {
            ...form,
            assignedBy: user.empid,
        };

        await dispatch(assignTask(payload)).unwrap();

        toast.success("Task assigned successfully");

        setForm({
            empId: "",
            taskTitle: "",
            description: "",
            dueDate: "",
            priority: "Medium",
        });

        handleClose();
        } catch (err) {
            const errorMessage =
                err?.message ||
                err ||
                "Failed to assign task"
            setError(errorMessage);
            toast.error(err);
        }
    };

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
            <DialogTitle>Assign Task</DialogTitle>
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
                        fullWidth
                        margin="normal"
                        label="Employee Name"
                        name="empId"
                        value={form.empId}
                        onChange={handleChange}
                        required
                    >
                        {employees?.map((emp) => (
                            <MenuItem key={emp.empId} value={emp.empId}>
                                {emp.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Task Title"
                        name="taskTitle"
                        value={form.taskTitle}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Description"
                        name="description"
                        multiline
                        rows={3}
                        value={form.description}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Due Date"
                        type="date"
                        name="dueDate"
                        InputLabelProps={{ shrink: true }}
                        value={form.dueDate}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        select
                        fullWidth
                        margin="normal"
                        label="Priority"
                        name="priority"
                        value={form.priority}
                        onChange={handleChange}
                        >
                        <MenuItem value="Low">Low</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="High">High</MenuItem>
                        <MenuItem value="Urgent">Urgent</MenuItem>
                    </TextField>
                </form>
            </DialogContent>
                <DialogActions>
<Button
  variant="outlined"
  color="primary"
  onClick={handleSubmit}
//   disabled={loading}
>
  {/* {loading ? "Assigning..." : "Assign"} */}Assign
</Button>
                    <Button onClick={handleClose} variant='outlined' color='error'>Cancel</Button>
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

export default AssignTaskDialog