import React, { useMemo, useState, useEffect, useRef } from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import Header from "../../components/Header";
import axios from "axios";
import { Button } from "@mui/material";
import * as XLSX from "xlsx"
import {saveAs} from "file-saver"
import DownloadIcon from "@mui/icons-material/Download";
import { Box } from "@mui/system";

const AllActivities = () => {
    const [rowData, setRowData] = useState([])
    const [user, setUser] = useState(null)
    const gridRef = useRef(null)


  useEffect(() => {
    const fetchUser = async () => {
        try{
            const response = await axios.get("http://localhost:3000/auth/profile", {withCredentials: true})
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
      {headerName: "Date",field: "date"},
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
    ])


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
        paddingTop: "140px",
        marginLeft: "30px",
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
    />

    </div>
    )
}

export default AllActivities;
