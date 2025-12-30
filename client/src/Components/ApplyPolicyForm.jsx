import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, TextField, Typography } from '@mui/material'
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from 'react'
import API from '../api/axiosInstance';

const ApplyPolicyForm = ({open, handleClose}) => {

    const [form, setForm] = useState({
            title: "",
            pdf: null
        })
    const [error, setError] = useState("")

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handlePdfChange = (e) => {
        const file = e.target.files[0]

        if(!file) return

        if (file.type !== "application/pdf") {
            alert("Only PDF files allowed");
            return;
        }

        setForm({
            ...form,
            pdf: file,
        });
    }

    const handleSubmit = async () => {
        if (!form.title || !form.pdf){
            setError("Title and PDF are required")
            return
        }

        const formData = new FormData()
        formData.append("title", form.title)
        formData.append("policy", form.pdf)

        try{
            await API.post("/api/policy", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })

            setForm({
                title: "",
                pdf: null,
            });

            handleClose();
        }catch(err){
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
            <DialogTitle>Add Policy</DialogTitle>
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
                        name='title'
                        label="Policy Title"
                        value={form.title}
                        onChange={handleChange}
                        fullWidth
                        margin='dense'
                        required
                        sx={{ mb: 4 }}
                    />

                    <Typography variant='outlined' sx={{ pr: 2 }}>
                        Upload Policy
                    </Typography>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={handlePdfChange}
                        />
                </form>
            </DialogContent>
                    <DialogActions>
                        <Button variant='outlined' color='primary' onClick={handleSubmit}>Add</Button>
                        <Button onClick={handleClose} variant='outlined' color="error">Cancel</Button>
                    </DialogActions>
        </Dialog>
    </div>
  )
}

export default ApplyPolicyForm