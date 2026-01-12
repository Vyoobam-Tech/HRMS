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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { deleteDepartment, updateDepartment, addDepartment, fetchDepartments } from "../../features/department/departmentSlice";
import { fetchNames } from "../../features/manageSlice";

ModuleRegistry.registerModules([AllCommunityModule]);

const Department = () => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const dispatch = useDispatch()
  const { list: rowData, loading} = useSelector(
    (state) => state.department
  )

  const { departmentNames, reportNames } = useSelector(
    (state) => state.names
  );

  const departmentNameList = departmentNames.map((d) => d.name);
  const reportNameList = reportNames.map((r) => r.name);


  useEffect(() => {

    dispatch(fetchDepartments())
    dispatch(fetchNames())
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteDepartment(id))
      toast.success("Department deleted");
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error("Delete failed");
    }
  };

  const handleEdit = (row) => {
    setSelectedRow(row);
    setShowEditModal(true);
  };

  const handleSave = async (values) => {
    try {
      await dispatch(updateDepartment({id: selectedRow.id, values}))
      toast.success("Department updated");
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating department:", error);
      toast.error("Update failed");
    }
  };

  const handleAddDepartment = async (values) => {
    try {
      await dispatch(addDepartment(values))
      toast.success("Department added successfully");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to add department ❌");
    }
  };

  const [columnDefs] = useState([
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
              setDeleteId(params.data.id);
              setConfirmOpen(true);
            }}
            color="error"
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
      width: 300,
    },
    { headerName: "Department Code", field: "code" },
    { headerName: "Department Name", field: "name" },
    { headerName: "Reporting To", field: "reporting" },
    { headerName: "Department Email", field: "email" },
    { headerName: "Project Assigned", field: "assigned" },
    { headerName: "Created By", field: "createdby" },
    { headerName: "Department Type", field: "type" },
    { headerName: "Skill Category", field: "category" },
    { headerName: "Working Model", field: "model" },
    { headerName: "HOD", field: "hod" },
    { headerName: "Total Employees", field: "total" },
    { headerName: "Status", field: "status" },
  ]);

  const DepartmentSchema = Yup.object().shape({
    code: Yup.string().required("Department Code is required"),
    name: Yup.string().required("Department name is required"),
    reporting: Yup.string().required("Reporting is required"),
    email: Yup.string().required("Department Email is required"),
    assigned: Yup.string().matches(/^[A-Za-z\s]+$/, "must contain only letters").required("Project Assigned is required"),
    createdby: Yup.string().required("Created By is required"),
    type: Yup.string().required("Department Type is required"),
    category: Yup.string().matches(/^[A-Za-z\s]+$/, "Skill must contain only letters").required("Skill category is required"),
    model: Yup.string().required("Working Model is required"),
    hod: Yup.string().matches(/^[A-Za-z\s]+$/, "HOD name must contain only letters").required("HOD is required"),
    status: Yup.string().required("Status is required"),
  });

  const defaultColDef = useMemo(
    () => ({
      filter: "agTextColumnFilter",
      floatingFilter: true,
    }),
    []
  );

  const departmentFields = [
  { name: "code", label: "Department Code" },
  {
    name: "name", 
    label: "Department Name",
    type: "select",
    options: departmentNameList
  },
  { 
    name: "reporting", 
    label: "Reporting To",
    type: "select",
    options: reportNameList
  },
  { name: "email", label: "Department Email" },
  { name: "assigned", label: "Project Assigned" },
  { 
    name: "createdby", 
    label: "Created By",
    type: "select",
    options: ["HR", "Admin"],
  },
  { 
    name: "type", 
    label: "Department Type",
    type: "select",
    options: ["IT", "Non IT"],
  },
  { name: "category", label: "Skill Category" },
  { 
    name: "model", 
    label: "Working Model",
    type: "select",
    options: ["Hybrid", "Remote", "Onsite"],
  },
  { name: "hod", label: "HOD Name" },
  { name: "total", label: "Total Employees", type: "number" },
  { 
    name: "status", 
    label: "Status",
    type: "select",
    options: ["Active", "In active"],
  },
];


  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        padding: "120px 40px 20px 40px",
        boxSizing: "border-box",
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
            code: "",
            name: "",
            reporting: "",
            email: "",
            assigned: "",
            createdby: "",
            type: "",
            category: "",
            model: "",
            hod: "",
            total: 0,
            status: "",
          }}
          validationSchema={DepartmentSchema}
          onSubmit={(values, { resetForm }) => {
            console.log("Submitting values:", values);
            handleAddDepartment(values);
            resetForm();
          }}
        >
          {({ errors, touched, setFieldValue }) => (
            <Form>
              <div className="modal-body" style={{ padding: "16px" }}>
                <DialogContent>
                  {departmentFields.map(({ name, label, type, options }) => (
                  <Field
                    key={name}
                    as={TextField}
                    name={name}
                    label={label}
                    select={type === "select"} 
                    fullWidth
                    margin="dense"
                    type={type || "text"}
                    error={touched[name] && !!errors[name]}
                    helperText={touched[name] && errors[name]}
                    InputLabelProps={type === "date" ? { shrink: true } : {}}
                    disabled={name === "total"}
                    onChange={async (e) => {
                      const value = e.target.value;

                      // normal Formik update
                      setFieldValue(name, value);

                      if (name === "name") {
                        try {
                          const res = await API.get(
                            `/auth/employees/count?department=${value.toLowerCase()}`
                          );
                          setFieldValue("total", res.data.total);
                        } catch (err) {
                          console.error(err);
                          setFieldValue("total", 0);
                        }
                      }
                    }}

                  >
                    {type === "select" && 
                      options.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                      ))}
                  </Field>
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
        <IconButton onClick={() => setShowEditModal(false)}>
          <CloseIcon sx={{ color: "white" }} />
        </IconButton>
      </div>

      {selectedRow && (
        <Formik
          initialValues={{
            code: selectedRow.code || "",
            name: selectedRow.name || "",
            reporting: selectedRow.reporting || "",
            email: selectedRow.email || "",
            assigned: selectedRow.assigned || "",
            createdby: selectedRow.createdby || "",
            type: selectedRow.type || "",
            category: selectedRow.category || "",
            model: selectedRow.model || "",
            hod: selectedRow.hod || "",
            total: selectedRow.total || 0,
            status: selectedRow.status || "",
          }}
          validationSchema={DepartmentSchema}
          onSubmit={(values) => handleSave(values)}
          enableReinitialize
        >
          {({ errors, touched, setFieldValue, values }) => {
            // Update total automatically whenever name changes
            useEffect(() => {
              const fetchTotal = async () => {
                if (values.name) {
                  try {
                    const res = await API.get(
                      `/auth/employees/count?department=${values.name.toLowerCase()}`
                    );
                    setFieldValue("total", res.data.total);
                  } catch {
                    setFieldValue("total", 0);
                  }
                }
              };
              fetchTotal();
            }, [values.name, setFieldValue]);

            return (
              <Form>
                <DialogContent>
                  {departmentFields.map(({ name, label, type, options }) => (
                    <Field
                      key={name}
                      as={TextField}
                      name={name}
                      label={label}
                      select={type === "select"}
                      fullWidth
                      margin="dense"
                      type={type || "text"}
                      value={values[name] || ""}
                      error={touched[name] && !!errors[name]}
                      helperText={touched[name] && errors[name]}
                      disabled={name === "total"}
                    >
                      {type === "select" &&
                        options.map((opt) => (
                          <MenuItem key={opt} value={opt}>
                            {opt}
                          </MenuItem>
                        ))}
                    </Field>
                  ))}
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                  <Button
                    onClick={() => setShowEditModal(false)}
                    color="error"
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" color="primary" variant="outlined">
                    Update Department
                  </Button>
                </DialogActions>
              </Form>
            );
          }}
        </Formik>
      )}
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

    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
    />
    </div>
  );
};

export default Department;
