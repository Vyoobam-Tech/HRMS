import React, { useMemo, useState, useEffect, useRef } from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
} from "@mui/material";
import Header from "../../Components/Header";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import API from "../../api/axiosInstance";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import EmployeeForm from "./EmployeeForm";
import { useDispatch, useSelector } from "react-redux";
import { deleteEmployee, fetchAllEmployees } from "../../features/employeeSlice";

ModuleRegistry.registerModules([AllCommunityModule]);

const Employees = () => {
  const [open, setOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const gridRef = useRef(null)

  const dispatch = useDispatch()
  const {all: rowData, loading, error } = useSelector((state) => 
    state.employee
  )

  const headersTemplate = {
    "Employee ID": "",
    "Employee Name": "",
    "Email": "",
    "Contact": "",
    "Father Name": "",
    "Mother Name": "",
    "Occupation": "",
    "Parent Contact": "",
    "Permanent Address": "",
    "Communication Address": "",
    "Gender": "",
    "Date of Birth": "",
    "Blood Group": "",
    "Marital Status": "",
    "Spouse Name": "",
    "Spouse Contact": "",
    "Aadhaar": "",
    "PAN": "",
    "10th Board": "",
    "10th Year": "",
    "10th Percentage": "",
    "12th Board": "",
    "12th Year": "",
    "12th Percentage": "",
    "UG University": "",
    "UG Year": "",
    "UG Percentage": "",
    "PG University": "",
    "PG Year": "",
    "PG Percentage": "",
    "Experience 1 Company": "",
    "Experience 1 Title": "",
    "Experience 1 Start Date": "",
    "Experience 1 End Date": "",
    "Experience 1 Description": "",
    "Experience 1 Skills": "",
    "Bank Name": "",
    "Account Number": "",
    "IFSC Code": "",
    "Branch": "",
  }

  useEffect(() => {
    dispatch(fetchAllEmployees())
  }, [dispatch]);

  const handleDelete = async (empId) => {
    try {
      await dispatch(deleteEmployee(empId))
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };


  const handleExportExcel = () => {
    const filteredNodes = gridRef.current.api.getRenderedNodes();
    const filteredData = filteredNodes.map((node) => node.data);

    let data = [];

    if (filteredData.length === 0) {
      data = [headersTemplate];
    } else {
      data = filteredData.map((emp) => ({
        "Employee ID": emp.empId || "",
        "Employee Name": emp.name || "",
        "Email": emp.email || "",
        "Contact": emp.contact || "",
        "Father Name": emp.fatherName || "",
        "Mother Name": emp.motherName || "",
        "Occupation": emp.occupation || "",
        "Parent Contact": emp.faormoNumber || "",
        "Permanent Address": emp.permanentAddress || "",
        "Communication Address": emp.communicationAddress || "",
        "Gender": emp.gender || "",
        "Date of Birth": emp.dob || "",
        "Blood Group": emp.bloodGroup || "",
        "Marital Status": emp.maritalStatus || "",
        "Spouse Name": emp.maritalStatus === "Married" ? emp.spouseName || "" : "",
        "Spouse Contact": emp.maritalStatus === "Married" ? emp.spouseContact || "" : "",
        "Aadhaar": emp.aadhaar || "",
        "PAN": emp.pan || "",
        "10th Board": emp.tenthBoard || "",
        "10th Year": emp.tenthYearofPassing || "",
        "10th Percentage": emp.tenthPercentage || "",
        "12th Board": emp.twelveBoard || "",
        "12th Year": emp.twelveYearofPassing || "",
        "12th Percentage": emp.twelvePercentage || "",
        "UG University": emp.ugUniversity || "",
        "UG Year": emp.ugYearofPassing || "",
        "UG Percentage": emp.ugPercentage || "",
        "PG University": emp.pgUniversity || "",
        "PG Year": emp.pgYearofPassing || "",
        "PG Percentage": emp.pgPercentage || "",
        ...(emp.hasExperience
          ? emp.experiences.reduce((acc, exp, idx) => {
              acc[`Experience ${idx + 1} Company`] = exp.company || "";
              acc[`Experience ${idx + 1} Title`] = exp.title || "";
              acc[`Experience ${idx + 1} Start Date`] = exp.startDate || "";
              acc[`Experience ${idx + 1} End Date`] = exp.endDate || "";
              acc[`Experience ${idx + 1} Description`] = exp.description || "";
              acc[`Experience ${idx + 1} Skills`] = exp.skills || "";
              return acc;
            }, {})
          : {}),
        "Bank Name": emp.bankName || "",
        "Account Number": emp.accountNumber || "",
        "IFSC Code": emp.ifscCode || "",
        "Branch": emp.branch || "",
      }));
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "EmployeeData");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([excelBuffer], { type: "application/octet-stream" }),
      "EmployeeData.xlsx"
    );
  };

  const handleImportExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (jsonData.length === 0) {
          alert("Excel file is empty");
          return;
        }

        // OPTIONAL: map Excel headers → backend fields if needed
        const formattedData = jsonData.map((row) => ({
          empId: row["Employee ID"],
          name: row["Employee Name"],
          email: row["Email"],
          contact: row["Contact"],
          fatherName: row["Father Name"],
          motherName: row["Mother Name"],
          gender: row["Gender"],
          dob: row["Date of Birth"],
          permanentAddress: row["Permanent Address"],
          communicationAddress: row["Communication Address"],
          aadhaar: row["Aadhaar"],
          pan: row["PAN"],
          bankName: row["Bank Name"],
          accountNumber: row["Account Number"],
          ifscCode: row["IFSC Code"],
          branch: row["Branch"],
        }));

        await API.post("/api/employees/import", formattedData);

        fetchAllEmployees();
        e.target.value = ""; // reset input
      } catch (error) {
        console.error("Import Error:", error);
        alert("Failed to import Excel");
      }
    };

    reader.readAsBinaryString(file);
  }


  const [columnDefs] = useState([
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
            color="error"
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
      width: 100,
    },
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
        minHeight: "100vh",
        width: "100%",
        padding: "120px 40px 20px 40px",
        boxSizing: "border-box",
      }}
    >
      <Header title="EMPLOYEES" subtitle="Organisation Employee Details" />

    <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2, gap: 2 }}>
      {/* <Button variant='contained' onClick={() => setOpen(true)} color='primary' sx={{ mb: 2 }}>
        Add Details
      </Button> */}
      <Button
        startIcon={<DownloadIcon />}
        variant="contained"
        onClick={handleExportExcel}
        sx={{
          backgroundColor: "#1D6F42",
          textTransform: "none",
          // mb: 2,
          // // ml: 2
        }}
      >
        Export Excel
      </Button>

      <input
        type="file"
        accept=".xlsx, .xls"
        style={{ display: "none" }}
        id="excel-upload"
        onChange={handleImportExcel}
      />

      <Button
        startIcon={<InsertDriveFileIcon />}
        variant="contained"
        color="primary"
        onClick={() => document.getElementById("excel-upload").click()}
        sx={{ textTransform: "none" }}
      >
        Import Excel
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
