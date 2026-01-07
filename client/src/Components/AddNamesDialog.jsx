import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import API from "../api/axiosInstance";

const AddNamesDialog = ({ open, onClose, title = "Add Name", label = "Name", items = [], setItems, type }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    try {
      const res = await API.post("/api/names", {
        name: name.trim(),
        type,
      });

      setItems((prev) => [...prev, res.data.data]);
      setName("");
      onClose();
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.message || "Failed to add name");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/names/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          label={label}
          value={name}
          margin="dense"
          autoFocus
          error={!!error}
          helperText={error}
          onChange={(e) => {
            const value = e.target.value;
            if (/^[A-Za-z\s]*$/.test(value)) {
              setName(value);
              setError("");
            } else {
              setError("Only letters are allowed");
            }
          }}
        />

        {items.length > 0 && (
          <>
            <Typography variant="subtitle2" sx={{ mt: 2 }}>
              Existing {title}
            </Typography>

            {items.map((item) => (
              <Typography
                key={item.id}
                sx={{
                  fontSize: 14,
                  color: "#555",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDelete(item.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
                {item.name}
              </Typography>
            ))}
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="error" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddNamesDialog;
