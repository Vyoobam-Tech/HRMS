import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom"; // ✅ Import added
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import hrmsData from "../../data/hrmsData.json";
import Header from "../../components/Header";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";

ModuleRegistry.registerModules([AllCommunityModule]);

const Reports = () => {
  const [searchParams] = useSearchParams();
  const selectedReport = searchParams.get("type") || "attendance";

  const attColumn = [
    { field: "id" },
    { field: "name" },
    { field: "department" },
    { field: "workDays" },
    { field: "presDays" },
    { field: "absDays" },
    { field: "leaveDays" },
    { field: "hours" },
  ];
  const leaveColumn = [
    { field: "id" },
    { field: "name" },
    { field: "department" },
    { field: "leaveType" },
    { field: "leaveDays" },
    { field: "leaveStatus" },
    { field: "date" },
    { field: "approve" },
  ];

  const defaultColDef = useMemo(() => {
    return {
      filter: "agTextColumnFilter",
      floatingFilter: true,
    };
  }, []);

  const getReportData = () => {
    switch (selectedReport) {
      case "attendance":
        return {
          title: "Employee's Attendance Report",
          columns: attColumn,
          data: hrmsData.reports.attendanceReport,
        };
      case "leave":
        return {
          title: "Employee's Leave Report",
          columns: leaveColumn,
          data: hrmsData.reports.leaveReport,
        };
      default:
        return {
          title: "Employee's Attendance Report",
          columns: attColumn,
          data: hrmsData.reports.attendanceReport,
        };
    }
  };

  const reportData = getReportData();

  return (
    <Box
      sx={{
        height: 450,
        marginRight: "60px",
        paddingTop: "140px",
        marginLeft: "30px",
      }}
    >
      <Header title="Reports" subtitle="Org Employee Reports" />
      <Typography variant="h5" mt={3} mb={3}>
        {reportData.title}
      </Typography>

      <AgGridReact
        rowData={reportData.data} 
        columnDefs={reportData.columns}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 25, 50]}
      />
    </Box>
  );
};

export default Reports;
