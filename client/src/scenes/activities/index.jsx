import React, { useMemo, useState, useEffect } from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Header from "../../components/Header";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

ModuleRegistry.registerModules([AllCommunityModule]);

const Activities = () => {
  const [rowData, setRowData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fetchActivities = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/activities/all"
      );
      setRowData(response.data.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleDelete = async (actid) => {
    try {
      await axios.delete(`http://localhost:3000/api/activities/${actid}`);
      fetchActivities();
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };

  const handleEdit = (row) => {
    setSelectedRow(row);
    setShowEditModal(true);
  };

  const handleSave = async () => {
    console.log("Saving Activity Data:", selectedRow);
    if (!selectedRow || !selectedRow.actid) return;
    try {
      await axios.put(
        `http://localhost:3000/api/activities/update/${selectedRow.actid}`,
        selectedRow
      );
      fetchActivities();
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating activity:", error);
    }
  };

  const addActivity = async (values) => {
    try {
      const payload = {
        ...values,
        actid: values.actid,
      };

      console.log("Payload:", payload);
      await axios.post("http://localhost:3000/api/activities", payload);
      setOpen(false);
      fetchActivities();
    } catch (error) {
      console.error("Error adding activity:", error);
    }
  };

  const [columnDefs] = useState([
    { headerName: "Act ID", field: "actid" },
    { headerName: "Employee Name", field: "employeeName" },
    { headerName: "Type", field: "type" },
    {
      headerName: "Date",
      field: "date",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return new Date(params.value).toLocaleDateString();
      },
    },
    { headerName: "Duration", field: "duration" },
    { headerName: "Department", field: "department" },
    { headerName: "Status", field: "status" },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <IconButton
            onClick={() => handleEdit(params.data)}
            color="primary"
            size="small"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              setDeleteId(params.data._id);
              setConfirmOpen(true);
            }}
            color="primary"
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
      width: 120,
    },
  ]);

  const ActivitySchema = Yup.object().shape({
    actid: Yup.string().required("ID is required"),
    employeeName: Yup.string().required("Employee Name is required"),
    type: Yup.string().required("Type is required"),
    date: Yup.date().required("Date is required"),
    duration: Yup.string().required("Duration is required"),
    department: Yup.string().required("Department is required"),
    status: Yup.string().required("Status is required"),
  });

  const defaultColDef = useMemo(
    () => ({
      filter: "agTextColumnFilter",
      floatingFilter: true,
    }),
    []
  );

  return (
    <div
      style={{
        height: 450,
        marginRight: "60px",
        paddingBottom: "35px",
        paddingTop: "140px",
        marginLeft: "30px",
      }}
    >
      <Header title="ACTIVITIES" subtitle="Employee Activity Tracking" />
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
        sx={{ mb: 2 }}
      >
        Add Activities
      </Button>

      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        domLayout="autoHeight"
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 25, 50]}
      />

      {/*Add Activity Modal*/}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
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
          <DialogTitle> Add Activity</DialogTitle>
          <IconButton onClick={() => setOpen(false)} color="dark">
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        </div>
        <Formik
          initialValues={{
            actid: "",
            employeeName: "",
            type: "",
            date: "",
            duration: "",
            department: "",
            status: "",
          }}
          validationSchema={ActivitySchema}
          onSubmit={(values, { resetForm }) => {
            console.log("Submitting values:", values);
            addActivity(values);
            resetForm();
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="modal-body" style={{ padding: "16px" }}>
                <DialogContent>
                  {[
                    "actid",
                    "employeeName",
                    "type",
                    "date",
                    "duration",
                    "department",
                    "status",
                  ].map((field) => (
                    <Field
                      key={field}
                      as={TextField}
                      name={field}
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      error={touched[field] && !!errors[field]}
                      helperText={touched[field] && errors[field]}
                      fullWidth
                      margin="dense"
                      type={field === "date" ? "date" : "text"}
                      InputLabelProps={field === "date" ? { shrink: true } : {}}
                    />
                  ))}
                </DialogContent>
              </div>
              <div
                className="modal-footer"
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  padding: "16px",
                  borderTop: "1px solid #ddd",
                }}
              >
                <DialogActions
                  sx={{
                    "&:hover": {
                      backgroundColor: "transparent",
                      boxShadow: "none",
                    },
                  }}
                >
                  <Button type="submit" variant="outlined" color="primary">
                    Add Activity
                  </Button>
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </div>
            </Form>
          )}
        </Formik>
      </Dialog>

      {/* Edit Activity*/}
      <Dialog
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        fullWidth
        maxWidth="sm"
      >
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
          <DialogTitle>Edit Activity</DialogTitle>
          <IconButton onClick={() => setShowEditModal(false)} color="dark">
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        </div>

        <div className="modal-body" style={{ padding: "16px" }}>
          <DialogContent>
            {selectedRow && (
              <>
                {Object.keys(selectedRow).map(
                  (key) =>
                    key !== "_id" &&
                    key !== "__v" && (
                      <TextField
                        key={key}
                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                        fullWidth
                        margin="dense"
                        type={key === "date" ? "date" : "text"}
                        value={
                          key === "date"
                            ? new Date(selectedRow[key])
                                .toISOString()
                                .split("T")[0]
                            : selectedRow[key] || ""
                        }
                        InputLabelProps={key === "date" ? { shrink: true } : {}}
                        onChange={(e) =>
                          setSelectedRow({
                            ...selectedRow,
                            [key]: e.target.value,
                          })
                        }
                      />
                    )
                )}
              </>
            )}
          </DialogContent>
        </div>

        <div
          className="modal-footer"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "16px",
            borderTop: "1px solid #ddd",
          }}
        >
          <DialogActions>
            <Button
              color="error"
              variant="outlined"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} color="primary" variant="outlined">
              Save
            </Button>
          </DialogActions>
        </div>
      </Dialog>

      {/* Delete Activity */}

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
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
          <DialogTitle>Confirm Deletion</DialogTitle>
          <IconButton onClick={() => setConfirmOpen(false)} color="dark">
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        </div>
        <div
          className="modal-body"
          style={{ padding: "16px", fontFamily: "Poppins" }}
        >
          <DialogContent>
            Are you sure want to delete this activity?
          </DialogContent>
        </div>
        <div
          className="modal-footer"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "16px",
            borderTop: "1px solid #ddd",
          }}
        >
          <DialogActions>
            <Button
              onClick={() => setConfirmOpen(false)}
              color="primary"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleDelete(deleteId);
                setConfirmOpen(false);
              }}
              color="error"
              variant="outlined"
            >
              Delete
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  );
};

export default Activities;
