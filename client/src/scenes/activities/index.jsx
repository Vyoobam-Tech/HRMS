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
  MenuItem,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Header from "../../Components/Header";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import API from "../../api/axiosInstance";

ModuleRegistry.registerModules([AllCommunityModule]);

const Activities = () => {
  const [rowData, setRowData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [user, setUser] = useState(null)
  const [employee,setEmployee] = useState(null)
  const [taskName, setTaskName] = useState("")
  const [startingtime, setStartingTime] = useState("")
  const [endingtime, setEndingTime] = useState("")
  const [durations, setDurations] = useState("")
 
  const dt = new Date().toISOString().split("T")[0]


  useEffect(() => {
    const fetchUser = async () => {
      try{
        const response = await API.get("/auth/profile")
        if(response.data.user){
          setUser(response.data.user)
        }
      } catch(err){
        console.log(err)
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    if (!user?.email) return
    const fetchEmployee = async () => {
      try{
        const response = await API.get(`/api/employees/by-user/${user.email}`)
        if(response.data.status){
          setEmployee(response.data.data)
        }
      } catch(err){
        console.log(err)
      }
    }
    fetchEmployee()
  }, [user])

  useEffect(() => {
    if (!user?.empid) return
    const fetchEachActivity = async () => {
      try{
      const response = await API.get(`/api/activities/by-user/${user.empid}`)
      setRowData(response.data.data)
      } catch(err){
        console.log(err)
      }
    }
    fetchEachActivity()
  }, [employee])


  const handleDelete = async (actid) => {
    try {
      await API.delete(`/api/activities/${actid}`);
      // fetchActivities();
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
      await API.put(
        `/api/activities/update/${selectedRow.actid}`,
        selectedRow
      );
      // fetchActivities();
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating activity:", error);
    }
  };

  const addActivity = async (values) => {
    try {
      const payload = {
        ...values,
        empid: values.empid,
        employeename: values.employeename,
        startingtime: values.startingtime,
        durations: values.durations
      };

      console.log("Payload:", payload)
      await API.post("/api/activities", payload)
      setOpen(false)
      setRowData((prev) => [...prev, payload])
    } catch (error) {
      console.error("Error adding activity:", error)
    }
  };

  const [columnDefs] = useState([

    {
      headerName: "Date",
      field: "date",
      valueFormatter: (paramas) => {
        if(!paramas.value) return ""
        const date = new Date(paramas.value)
        const day = String(date.getDay()).padStart(2, 0)
        const month = String(date.getMonth() + 1).padStart(2, 0)
        const year = date.getFullYear()
        return `${day}-${month}-${year}`
      }
    },
    { headerName: "Emp ID", field: "empid" },
    { headerName: "Employee Name", field: "employeename" },
    { headerName: "Task Name", field: "taskname" },
    { headerName: "Starting Time", field: "startingtime" },
    { headerName: "Ending Time", field: "endingtime" },
    { headerName: "Durations", field: "duration"},
    { headerName: "% Complete", field: "complete" },
    { headerName: "Status", field: "status" },
    { headerName: "Remarks", field: "remarks" },
    { headerName: "Github Link", field: "githublink"}
  ]);


  const ActivitySchema = Yup.object().shape({
    taskname: Yup.string().required("Task Name is required"),
    duration: Yup.string().required("Duration is required"),
    status: Yup.string().required("Status is required"),
    complete: Yup.string().required("Complete is required")
  
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
        minHeight: "100vh",
        width: "100%",
        padding: "120px 40px 20px 40px",
        boxSizing: "border-box",
      }}
    >
      <Header title="MY ACTIVITIES" />
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          if (!startingtime) {
            const now = new Date();
            const hh = now.getHours().toString().padStart(2, "0");
            const mm = now.getMinutes().toString().padStart(2, "0");
            const formatted = `${hh}:${mm}`; // "HH:MM" 24-hour format
            setStartingTime(formatted);
            localStorage.setItem("activitystart", formatted);
          }
          setOpen(true);
        }}
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
        onGridReady={(paramas) => {
          paramas.api.sizeColumnsToFit()
        }}
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
        enableReinitialize
          initialValues={{
            empid: user?.empid || "",
            employeename: employee?.name || "",
            taskname: "",
            date: dt,
            startingtime: startingtime,
            endingtime: endingtime,
            duration: durations,
            complete: "",
            status: "",
            remarks: "",
            githublink: ""
          }}
          validationSchema={ActivitySchema}
          onSubmit={(values, { resetForm }) => {
            console.log("Submitting values:", values);
            addActivity(values);
            resetForm();
          }}
        >
          {({ errors, touched, setFieldValue }) => (
            <Form>
              <div className="modal-body" style={{ padding: "16px" }}>
                <DialogContent>
                  {[
                    "date",
                    "empid",
                    "employeename",
                    "startingTime",
                    "endingtime",
                    "duration",
                    "taskname",
                    "complete",
                    "status",
                    "remarks",
                    "githublink"
                  ].map((field) => {

                    if (field === "date") {
                      return (
                        <Field
                          key={field}
                          as={TextField}
                          name={field}
                          label="Date"
                          type="date"
                          fullWidth
                          margin="dense"
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ readOnly: true }}
                          value={dt}
                        />
                      );
                    }

                    if (field === "empid") {
                      return (
                        <Field
                          key={field}
                          as={TextField}
                          name={field}
                          label="Employee ID"
                          fullWidth
                          margin="dense"
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ readOnly: true }}
                        />
                      );
                    }

                    if (field === "employeename") {
                      return (
                        <Field
                          key={field}
                          as={TextField}
                          name={field}
                          label="Emplpoyee Name"
                          fullWidth
                          margin="dense"
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ readOnly: true }}
                        />
                      );
                    }

                    if (field === "startingTime") {
                      return (
                        <Field
                          as={TextField}
                          name="startingTime"
                          label="Starting Time"
                          fullWidth
                          margin="dense"
                          InputProps={{ readOnly: true }}
                          value={startingtime}
                        />
                      )
                    }


                    if (field === "complete") {
                      return (
                      <Field
                        key={field}
                        as={TextField}
                        name={field}
                        label="Complete"
                        select
                        fullWidth
                        margin="dense"
                        helperText={touched[field] && errors[field]}
                        error={touched[field] && !!errors[field]}
                      >
                        {["25%","50%","75%","100%"].map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}

                      </Field>
                  )}

                  if (field === "status") {
                      return (
                      <Field
                        key={field}
                        as={TextField}
                        name={field}
                        label="Status"
                        select
                        fullWidth
                        margin="dense"
                        helperText={touched[field] && errors[field]}
                        error={touched[field] && !!errors[field]}
                      >
                        {["on Hold","In Progess","Completed"].map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}

                      </Field>
                  )}

                  return (
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
                  )
                  })}
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
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      const now = new Date();
                      const hh = now.getHours().toString().padStart(2, "0");
                      const mm = now.getMinutes().toString().padStart(2, "0");
                      const formatted = `${hh}:${mm}`; // HH:MM 24-hour
                      setEndingTime(formatted);

                      if (startingtime) {
                        const [startH, startM] = startingtime.split(":").map(Number);
                        const [endH, endM] = formatted.split(":").map(Number);

                        let totalMinutes = (endH * 60 + endM) - (startH * 60 + startM);
                        // if (totalMinutes < 0) totalMinutes += 24 * 60;

                        const hours = Math.floor(totalMinutes / 60);
                        const minutes = totalMinutes % 60;
                        const dur = `${hours}h ${minutes}m`;

                        setDurations(dur);

                        // Update Formik fields
                        setFieldValue("endingtime", formatted);
                        setFieldValue("durations", dur);
                      }
                    }}
                  >
                    End Activity
                  </Button>

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
