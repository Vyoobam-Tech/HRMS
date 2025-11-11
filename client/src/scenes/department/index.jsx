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
  Card,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
<<<<<<< HEAD
import Header from "@/components/Header.jsx";
=======
import Header from "../../components/Header";
>>>>>>> parent of 25f6374 (header fix)
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import API from "../../api/axiosInstance";
ModuleRegistry.registerModules([AllCommunityModule]);

const Department = () => {
  const [rowData, setRowData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fetchDepartments = async () => {
    try {
      const response = await API.get(
        "/api/departments/all"
      );
      setRowData(response.data.data);
    } catch (error) {
      console.error("Error fetching department:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDelete = async (depid) => {
    try {
      console.log("Deleting department with ID:", depid); 
      await API.delete(
        `/api/departments/delete/${depid}`
      );
      fetchDepartments();
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  const handleEdit = (row) => {
    setSelectedRow(row);
    setShowEditModal(true);
  };

  const handleSave = async () => {
    console.log("Saving Employee Data:", selectedRow);
    if (!selectedRow || !selectedRow.depid) return;
    try {
      await API.put(
        `/api/departments/update/${selectedRow.depid}`,
        selectedRow
      );
      fetchDepartments();
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating department:", error);
    }
  };

  const addDepartment = async (values) => {
    try {
      const payload = {
        ...values,
        depid: values.depid.toString(),
        // code: values.code.toString(),
      };

      console.log("Payload:", payload);
      await API.post("/api/departments", payload);
      await fetchDepartments();
      setOpen(false);
    } catch (error) {
      console.error("Error adding department:", error);
    }
  };

  const [columnDefs] = useState([
    { headerName: " Dep ID", field: "depid" },
    { headerName: "Department Name", field: "name" },
    // { headerName: "Code", field: "code" },
    { headerName: "Description", field: "description" },
    // { headerName: "Branch", field: "branch" },
    { headerName: "HOD", field: "hod" },
    // { headerName: "Reporting Manager", field: "reporting" },
    { headerName: "Total Employees", field: "total" },
    // { headerName: "Budget Allocation", field: "budget" },
    {
      headerName: "Created Date",
      field: "created",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return new Date(params.value).toLocaleDateString();
      },
    },
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
              setDeleteId(params.data.depid);
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

  const DepartmentSchema = Yup.object().shape({
    depid: Yup.string().required("Department ID is required"),
    name: Yup.string().required("Department name is required"),
    description: Yup.string().required("Description is required"),
    hod: Yup.string().required("HOD is required"),
    total: Yup.number().required("Total Employees is required").integer(),
    created: Yup.date().required("Created Date is required"),
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
        paddingTop: "100px",
      }}
    >
      <Header title="DEPARTMENT" subtitle="Organisation Departments Details" />{" "}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
        sx={{ mb: 2 }}
      >
        Add Department
      </Button>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        domLayout="autoHeight"
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 25, 50]}
        onGridReady={(params) => {
          params.api.sizeColumnsToFit()
        }}
      />
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
          <DialogTitle> Add Department</DialogTitle>
          <IconButton onClick={() => setOpen(false)} color="dark">
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        </div>
        <Formik
          initialValues={{
            depid: "",
            name: "",
            code: "",
            description: "",
            branch: "",
            hod: "",
            reporting: "",
            total: "",
            budget: "",
            created: "",
            status: "",
          }}
          validationSchema={DepartmentSchema}
          onSubmit={(values, { resetForm }) => {
            console.log("Submitting values:", values);
            addDepartment(values);
            resetForm();
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="modal-body" style={{ padding: "16px" }}>
                <DialogContent>
                  {[
                    "depid",
                    "name",
                    // "code",
                    "description",
                    // "branch",
                    "hod",
                    // "reporting",
                    "total",
                    // "budget",
                    "created",
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
                      type={
                        field === "created"
                          ? "date"
                          : ["total", "budget"].includes(field)
                          ? "number"
                          : "text"
                      }
                      InputLabelProps={
                        field === "created" ? { shrink: true } : {}
                      }
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
                    Add Department
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
          <DialogTitle>Edit Department</DialogTitle>
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
                        type={key === "created" ? "date" : "text"}
                        value={
                          key === "date"
                            ? new Date(selectedRow[key])
                                .toISOString()
                                .split("T")[0]
                            : selectedRow[key] || ""
                        }
                        InputLabelProps={
                          key === "craeted" ? { shrink: true } : {}
                        }
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
            Are you sure want to delete this department?
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

export default Department;
