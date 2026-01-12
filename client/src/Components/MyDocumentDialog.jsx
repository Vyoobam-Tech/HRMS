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
import { useDispatch, useSelector } from "react-redux";
import { addDocument, fetchDocuments } from "../features/policySlice";


const MyDocumentsDialog = ({ open, onClose, user }) => {
  const [files, setFiles] = useState({
    photo: null,
    aadhar: null,
    pan: null,
    license: null,
  });
  const [error, setError] = useState("")

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.policy);


  const handleChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleUpload = async () => {
  if (!user?.empid) {
    setError("Employee ID is required");
    return;
  }

  const hasFile = Object.values(files).some((file) => file !== null);

  if (!hasFile) {
    setError("Please upload at least one document");
    return
  }

  const formData = new FormData();

  Object.keys(files).forEach((key) => {
    if (files[key]) {
      formData.append(key, files[key]);
    }
  });

  try {
    const result = await dispatch(
      addDocument({ empid: user.empid, formData })
    );

  if (addDocument.fulfilled.match(result)) {
      dispatch(fetchDocuments(user.empid)); // refresh list

      setFiles({
        photo: null,
        aadhar: null,
        pan: null,
        license: null,
      });

      setError("");
      onClose();
    } else {
      setError(result.payload || "Upload failed");
    }
  } catch (err) {
    setError(
      result.payload ||
      result.error?.message ||
      "Only PDF, JPEG, PNG files are allowed and file size must be less than 10MB"
    );
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
        <Button variant="outlined" onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </Button>
        <Button variant="outlined" onClick={onClose} color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MyDocumentsDialog;
