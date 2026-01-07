import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import AddNamesDialog from "../../Components/AddNamesDialog";
import API from "../../api/axiosInstance";
import Header from "../../Components/Header";

const Index = () => {
  const [departmentNames, setDepartmentNames] = useState([]);
  const [reportNames, setReportNames] = useState([]);
  const [openDepartment, setOpenDepartment] = useState(false);
  const [openReport, setOpenReport] = useState(false);

  const fetchNames = async () => {
    try {
      const res = await API.get("/api/names/all");
      const data = res.data.data;

      setDepartmentNames(data.filter((n) => n.type === "DEPARTMENT"));
      setReportNames(data.filter((n) => n.type === "REPORT"));
    } catch (err) {
      console.error("Error fetching names:", err);
    }
  };

  useEffect(() => {
    fetchNames();
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", width: "100%", padding: "120px 40px 20px 40px" }}>
      <Header title="MANAGE" subtitle="Organisation Departments Manage" />{" "}
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setOpenDepartment(true)}
        sx={{ mr: 2 }}
      >
        Add Department
      </Button>

      <Button
        variant="contained"
        color="secondary"
        onClick={() => setOpenReport(true)}
      >
        Add Report
      </Button>

      <AddNamesDialog
        open={openDepartment}
        onClose={() => setOpenDepartment(false)}
        title="Department"
        label="Department Name"
        items={departmentNames}
        setItems={setDepartmentNames}
        type="DEPARTMENT"
      />

      <AddNamesDialog
        open={openReport}
        onClose={() => setOpenReport(false)}
        title="Report To"
        label="Report Name"
        items={reportNames}
        setItems={setReportNames}
        type="REPORT"
      />
    </Box>
  );
};

export default Index;
