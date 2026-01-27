import React, { useMemo, useState, useEffect, useRef } from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import AssignTaskDialog from "../../Components/AssignTaskDialog";
import Header from "../../Components/Header.jsx";
import { Button, Card, CardContent, Chip, IconButton, Typography } from "@mui/material";
import * as XLSX from "xlsx"
import {saveAs} from "file-saver"
import DownloadIcon from "@mui/icons-material/Download";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { Box, Stack } from "@mui/system";
import API from "../../api/axiosInstance";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { deleteActivity, fetchAllActivities } from "../../features/activitySlice.js";
import { deleteTasks, fetchAllTasks } from "../../features/taskSlice.js";

const AllActivities = () => {

    const [open, setOpen] = useState(false)
    const gridRef = useRef(null)

    const dispatch = useDispatch()

    const { allActivities, loading, error} = useSelector((state) =>
      state.activity
    )

    const tasks = useSelector((state) => state.task?.all || [])

    const headerTemplate = {
      "Date": "",
      "Employee ID": "",
      "Employee Name": "",
      "Task Name": "",
      "Starting Time": "",
      "Ending Time": "",
      "Durations": "",
      "% Complete": "",
      "Status": "",
      "Remarks": "",
      "Github Link": ""
    }

  // useEffect(() => {
  //   const fetchUser = async () => {
  //       try{
  //           const response = await API.get("/auth/profile")
  //           if(response.data.user){
  //           setUser(response.data.user)
  //       }
  //       } catch(err){
  //       console.log(err)
  //   }
  //   }
  //   fetchUser()
  // }, [])

  useEffect(() => {
    dispatch(fetchAllActivities())
    dispatch(fetchAllTasks())
  }, [dispatch])


  const handleExportExcel = () => {
    const filteredNodes = gridRef.current.api.getRenderedNodes()
    const filteredData = filteredNodes.map((node) => node.data)

    let data = []

    if(filteredData.length === 0){
      data = [headerTemplate]
    } else{
      data = filteredData.map((act) => ({
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
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ActivityReport");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "ActivityReport.xlsx");
  }

    const handleDelete = (row) => {
      dispatch(deleteActivity(row.id))
    };

    const handleDeleteTask = (taskId) => {
      dispatch(deleteTasks(taskId));
    };




    const [columnDefs] = useState([
      {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <IconButton
            onClick={() => {
              handleDelete(params.data)
            }}
            color="error"
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
      width: 80,
    },

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

  reader.onload = async (e) => {
    try{

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
      await API.post("/api/activities/bulk", {
          activities: jsonData,
        });

        fetchAllActivities();
      }catch(err){
        console.error("Import failed:", error);
        alert("Failed to import Excel");
      }
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
        minHeight: "100vh",
        width: "100%",
        padding: "120px 40px 20px 40px",
        boxSizing: "border-box",
    }}
    >
    <Header title="ACTIVITIES" />

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

      <Button
        variant="contained"
        color="secondary"
        sx={{ textTransform: "none" }}
        onClick={() => setOpen(true)}
      >
        Assign Task
      </Button>
      <AssignTaskDialog open={open} handleClose={() => setOpen(false)}/>

    </Box>
        
    <AgGridReact
        ref={gridRef}
        rowData={allActivities}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        domLayout="autoHeight"
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 25, 50, 100, 1000]}
        // onGridReady={(params) => {
        //   params.api.sizeColumnsToFit()
        // }}
    />

    <Box sx={{ mt: 4 }}>
            <Header title="TASKS" />
          </Box>
          {tasks.length === 0 && <p>No tasks assigned</p>}
    
      {tasks.map((task) => (
        <Card key={task.taskId} sx={{ mb: 2, borderRadius: 2, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {task.taskTitle}
            </Typography>

            <Typography color="text.secondary" gutterBottom>
              {task.description}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              mt={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={1}>
                <Chip label={task.priority} color="primary" size="small" sx={{ height: 34, borderRadius: 0 }} />
                <Chip label={task.status} color="success" size="small" sx={{ height: 34, borderRadius: 0 }}/>
                <Chip
                  label={`Due: ${new Date(task.dueDate).toLocaleDateString()}`}
                  size="small"
                  sx={{ height: 34, borderRadius: 0 }}
                />
              </Stack>

              <IconButton
                color="error"
                aria-label="delete"
                onClick={() => handleDeleteTask(task.taskId)}
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          </CardContent>
        </Card>
      ))}



    </div>
    )
}

export default AllActivities;
