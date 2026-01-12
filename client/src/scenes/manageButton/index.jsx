import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import AddNamesDialog from "../../Components/AddNamesDialog";
import Header from "../../Components/Header";
import { useDispatch, useSelector } from "react-redux";
import { fetchNames } from "../../features/manageSlice";

const Index = () => {

  const dispatch = useDispatch()
  const {departmentNames, reportNames, loading, error} = useSelector((state) =>
  state.names
  )
  const [openDepartment, setOpenDepartment] = useState(false);
  const [openReport, setOpenReport] = useState(false);

  useEffect(() => {
    dispatch(fetchNames())
  }, [dispatch]);

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
        Add Reporting To
      </Button>

      <AddNamesDialog
        open={openDepartment}
        onClose={() => setOpenDepartment(false)}
        title="Department"
        label="Department Name"
        items={departmentNames}
        // setItems={setDepartmentNames}
        type="DEPARTMENT"
      />

      <AddNamesDialog
        open={openReport}
        onClose={() => setOpenReport(false)}
        title="Reporting To"
        label="Reporting"
        items={reportNames}
        // setItems={setReportNames}
        type="REPORT"
      />
    </Box>
  );
};

export default Index;
