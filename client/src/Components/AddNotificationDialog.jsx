import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from '@mui/material'
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { createNotification, deleteNotification, fetchNotifications } from '../features/notificationSlice';
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from 'react';
import DeleteIcon from "@mui/icons-material/Delete";

const AddNotificationDialog = ({ open, onClose, showExisting = true }) => {

    const [title, setTitle] = useState("")
    const [message, setMessage] = useState("")
    const [error, setError] = useState("");
    

    const dispatch = useDispatch()
    const notifications = useSelector(
        (state) => state.notification.list
    )

    useEffect(() => {
    if (open) {
        dispatch(fetchNotifications());
    }
    }, [open, dispatch]);


    const handleCreate = () => {
        if (!title.trim()) {
            setError("Title is required");
            return
        }

        if (!message.trim()) {
            setError("Message is required");
            return
        }

        setError("")

        dispatch(createNotification({title, message}))

        toast.success("Notification Added successfully")
        setTitle("")
        setMessage("")
        onClose()
    }
    

  return (
    <div>
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
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
            <DialogTitle>Create Notification</DialogTitle>
            <IconButton  onClick={onClose}>
                <CloseIcon sx={{ color: "white" }}/>
            </IconButton>
            </div>
            {error && (
                <Typography align="center" color="error" sx={{ mt: 1 }}>
                    {error}
                </Typography>
            )}
            <DialogContent>
                    <TextField
                        label="Title"
                        fullWidth
                        margin='normal'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <TextField
                        label="Message"
                        multiline
                        rows={4}
                        fullWidth
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    {showExisting && notifications.length > 0 && (
                    <>
                    <Typography variant="subtitle2" sx={{ mt: 2 }}>
                        Existing Notification
                    </Typography>

                    {notifications.map((item) => (
                        <Typography
                        key={item.id}
                        sx={{
                            fontSize: 14,
                            color: "#555",
                            mt: 0.5,
                        }}
                        >
                        <IconButton
                        size="small"
                        color="error"
                        onClick={() => dispatch(deleteNotification(item.notificationId))}
                        >
                        <DeleteIcon fontSize="small" />
                        </IconButton>
                        {item.title}
                        </Typography>
                    ))}
                    </>
                )}

            </DialogContent>
            <DialogActions>
                <Button variant='outlined' color='primary' onClick={handleCreate}>Create</Button>
                <Button onClick={onClose} variant='outlined' color="error">Cancel</Button>
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

export default AddNotificationDialog