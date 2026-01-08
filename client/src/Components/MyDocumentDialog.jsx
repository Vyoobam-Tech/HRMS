import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import API from "../api/axiosInstance";
import CloseIcon from "@mui/icons-material/Close";


const MyDocumentsDialog = ({ open, onClose, user }) => {
  const [files, setFiles] = useState({
    photo: null,
    aadhar: null,
    pan: null,
    license: null,
  });
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleUpload = async () => {
    if (!user?.empid) {
      alert("Employee ID is required");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("empid", user.empid)

      Object.keys(files).forEach((key) => {
        if (files[key]) {
          formData.append(key, files[key]);
        }
      });

      await API.post("/api/document/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onClose();
    } catch (err) {
      console.log(err);
      const message = "Only PDF, JPEG, PNG files are allowed and file size must be less than 10MB"
      setError(message)
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
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
            <DialogTitle>My Document</DialogTitle>
            <IconButton  onClick={onClose}>
                <CloseIcon sx={{ color: "white" }}/>
            </IconButton>
            </div>

            {error && (
  <Typography align="center" color="error" sx={{ m: 2 }}>
    {error}
  </Typography>
)}


      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Typography>Employee Photo</Typography>
          <input type="file" name="photo" onChange={handleChange} accept=".pdf,.jpg,.jpeg,.png"/>

          <Typography>Aadhaar Card</Typography>
          <input type="file" name="aadhar" onChange={handleChange} accept=".pdf,.jpg,.jpeg,.png"/>

          <Typography>PAN Card</Typography>
          <input type="file" name="pan" onChange={handleChange} accept=".pdf,.jpg,.jpeg,.png"/>

          <Typography>Driving License</Typography>
          <input type="file" name="license" onChange={handleChange} accept=".pdf,.jpg,.jpeg,.png"/>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={handleUpload}>
          Upload
        </Button>
        <Button variant="outlined" onClick={onClose} color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MyDocumentsDialog;
