import React, { useMemo, useState, useEffect, useRef } from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import Header from "@/components/Header.jsx";
import { Button } from "@mui/material";
import * as XLSX from "xlsx"
import {saveAs} from "file-saver"
import DownloadIcon from "@mui/icons-material/Download";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { Box } from "@mui/system";
import API from "../../api/axiosInstance";

const AllActivities = () => {
    const [rowData, setRowData] = useState([])
    const [user, setUser] = useState(null)
    const gridRef = useRef(null)


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

  const fetchActivities = async () => {
    try {
      const response = await API.get(
        "/api/activities/all"
      );
      setRowData(response.data.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  useEffect(() => {
    if(!user) return
    fetchActivities();
  }, [user]);


  const handleExportExcel = () => {
    const filteredNodes = gridRef.current.api.getRenderedNodes()
    const filteredData = filteredNodes.map((node) => node.data)
    const data = filteredData.map((act) => ({
      "Date" : act.date,
      "Employee ID" : act.empid,
      "Employee Name" : act.employeename,
      "Task Name" : act.taskname,
      "Starting Time" : act.startingtime,
      "Ending Time" : act.endingtime,
      "Durations" : act.duration,
      "% Complete" : act.complete,
      "Status" : act.status,
      "Remarks" : act.remarks,
      "Github Link" : act.githublink
    }))

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ActivityReport");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "ActivityReport.xlsx");
  }


    const [columnDefs] = useState([
      {headerName: "Date",field: "date",
        valueFormatter: (params) => {
        if (!params.value) return "";
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      },
      },
      { headerName: "Employee ID", field: "empid" },
      { headerName: "Employee Name", field: "employeename" },
      { headerName: "Task Name", field: "taskname" },
      { headerName: "Starting Time", field: "startingtime" },
      { headerName: "Ending Time", field: "endingtime" },
      { headerName: "Durations", field: "duration"},
      { headerName: "% Complete", field: "complete" },
      { headerName: "Status", field: "status" },
      { headerName: "Remarks", field: "remarks" },
      { headerName: "Github Link", field: "githublink"}
    ])

  const handleImportExcel = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // raw: false → get Excel formatted text exactly as shown
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "", raw: false }).map((row) => {
      // Convert string dates 10/10/2025 → 10-10-2025
      let rawDate = row["Date"] || row["date"] || row["DATE"] || "";
      let formattedDate = rawDate ? rawDate.toString().replace(/\//g, "-") : "";

      return {
        date: formattedDate,
        empid: row["Employee ID"] || "",
        employeename: row["Employee Name"] || "",
        taskname: row["Task Name"] || "",
        startingtime: row["Starting Time"] || "",
        endingtime: row["Ending Time"] || "",
        duration: row["Durations"] || "",
        complete: row["% Complete"] || "",
        status: row["Status"] || "",
        remarks: row["Remarks"] || "",
        githublink: row["Github Link"] || "",
      };
    });

    setRowData((prev) => [...prev, ...jsonData]);
  };

  reader.readAsArrayBuffer(file);
  event.target.value = "";
};



  const defaultColDef = useMemo(() => ({
    filter: "agTextColumnFilter",
    floatingFilter: true,
    }),[])

  return (
    <div
    style={{
        height: 450,
        marginRight: "60px",
        paddingBottom: "35px",
        paddingTop: "100px",
    }}
    >
    <Header title="ACTIVITIES" subtitle="Employee Activity Tracking" />

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
        paginationPageSizeSelector={[10, 25, 50, 100, 1000]}
        onGridReady={(params) => {
          params.api.sizeColumnsToFit()
        }}
    />

    </div>
    )
}

export default AllActivities;
