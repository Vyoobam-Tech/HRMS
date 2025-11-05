import React, { useMemo, useState, useEffect, useRef } from "react";
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
  Box,
  Tabs,
  Tab,
  Typography,
  Select,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Header from "../../components/Header";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import {margin } from "@mui/system";
import { Grid } from '@mui/material';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import EmployeeForm from "./EmployeeForm";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import API from "../../api/axiosInstance";

ModuleRegistry.registerModules([AllCommunityModule]);

const Employees = () => {
  const [rowData, setRowData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0)
  const [dob, setDob] = useState(null)
  const gridRef = useRef(null)
  const [error, setError] = useState({})

  const fetchEmployees = async () => {
    try {
      const response = await API.get(
        "/api/employees/all"
      );
      setRowData(response.data.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (empId) => {
    try {
      await API.delete(`/api/employees/delete/${empId}`);
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };


const handleExportExcel = () => {
  const filteredNodes = gridRef.current.api.getRenderedNodes()
  const filteredData = filteredNodes.map((node) => node.data)
  const data = filteredData.map((emp) => (
    {
      "Employee ID": emp.empId || "",
      "Employee Name": emp.name,
      "Email": emp.email || "",
      "Contact": emp.contact,
      "Father Name": emp.fatherName,
      "Mother Name": emp.motherName,
      "Occupation": emp.occupation,
      "Parent Contact": emp.faormoNumber,
      "Permanent Address": emp.permanentAddress,
      "Communication Address": emp.communicationAddress,
      "Gender": emp.gender,
      "Date of Birth": emp.dob,
      "Blood Group": emp.bloodGroup,
      "Marital Status": emp.maritalStatus,
      "Spouse Name": emp.maritalStatus === "Married" ? emp.spouseName : "",
      "Spouse Contact": emp.maritalStatus === "Married" ? emp.spouseContact : "",
      "Aadhaar": emp.aadhaar,
      "PAN": emp.pan,
      "10th Board": emp.tenthBoard,
      "10th Year": emp.tenthYearofPassing,
      "10th Percentage": emp.tenthPercentage,
      "12th Board": emp.twelveBoard,
      "12th Year": emp.twelveYearofPassing,
      "12th Percentage": emp.twelvePercentage,
      "UG University": emp.ugUniversity,
      "UG Year": emp.ugYearofPassing,
      "UG Percentage": emp.ugPercentage,
      "PG University": emp.pgUniversity,
      "PG Year": emp.pgYearofPassing,
      "PG Percentage": emp.pgPercentage,
      // Flatten experiences individually like separate columns
      ...(emp.hasExperience
        ? emp.experiences.reduce((acc, exp, idx) => {
            acc[`Experience ${idx + 1} Company`] = exp.company;
            acc[`Experience ${idx + 1} Title`] = exp.title;
            acc[`Experience ${idx + 1} Start Date`] = exp.startDate;
            acc[`Experience ${idx + 1} End Date`] = exp.endDate;
            acc[`Experience ${idx + 1} Description`] = exp.description;
            acc[`Experience ${idx + 1} Skills`] = exp.skills;
            return acc;
          }, {})
        : {"Experience": "None"}),
      "Bank Name": emp.bankName,
      "Account Number": emp.accountNumber,
      "IFSC Code": emp.ifscCode,
      "Branch": emp.branch,
    }
  ))

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "EmployeeData");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "EmployeeData.xlsx");
};


  const [columnDefs] = useState([
    { headerName: " Emp ID", field: "empId" },
    { headerName: "Employee Name", field: "name" },
    { headerName: "Gender", field: "gender" },
    {
      headerName: "Date of Birth",
      field: "dob",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return new Date(params.value).toLocaleDateString();
      },
    },
    { headerName: "Email ID", field: "email" },
    { headerName: "Contact Number", field: "contact" },
    { headerName: "Address", field: "permanentAddress" },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <div>
          <IconButton
            onClick={() => {
              setDeleteId(params.data.empId);
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
      <Header title="EMPLOYEES" subtitle="Organisation Employee Details" />

      <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2, gap: 2 }}>
      <Button
        startIcon={<DownloadIcon />}
        variant="contained"
        onClick={handleExportExcel}
        sx={{
          backgroundColor: "#1D6F42",
          textTransform: "none",
        }}
      >
        Export Excel
      </Button>
    </Box>

      <AgGridReact
        ref={gridRef}
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
            Are you sure want to delete this employee?
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

export default Employees;
