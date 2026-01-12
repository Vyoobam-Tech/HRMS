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
import { useDispatch } from "react-redux";
import { addName, deleteName } from "../features/manageSlice";

const AddNamesDialog = ({ open, onClose, title = "Add Name", label = "Name", items = [], setItems, type }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch()

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

      dispatch(addName({ name: name.trim(), type }));
      setName("");
      setError("")
      onClose();
  };

  const handleDelete = async (id) => {
    dispatch(deleteName({id, type}))
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
