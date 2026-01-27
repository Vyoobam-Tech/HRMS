import React, { useEffect, useState } from "react";
import Header from "../../Components/Header";
import { 
  Box, 
  Button, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField, 
  Typography, 
  Tabs, 
  Tab,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  Alert
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { fetchComponents, addComponent, fetchHistory, runPayroll, fetchAllEmployees, assignSalary, clearMessages } from "../../features/payrollSlice";
import DownloadIcon from '@mui/icons-material/Download';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { BASE_URL } from "../../api/axiosInstance";

const Payroll = () => {
    const dispatch = useDispatch();
    const [tabIndex, setTabIndex] = useState(0);
    const { components, history, employeesList, success, error } = useSelector((state) => state.payroll);
    const { user } = useSelector((state) => state.auth);

    // Modal States
    const [openComponentDialog, setOpenComponentDialog] = useState(false);
    const [openPayrollDialog, setOpenPayrollDialog] = useState(false);
    const [openAssignDialog, setOpenAssignDialog] = useState(false);
    
    // Config Form
    const [compName, setCompName] = useState("");
    const [compType, setCompType] = useState("earning");

    // Assign Form
    const [selectedEmp, setSelectedEmp] = useState("");
    const [salaryValues, setSalaryValues] = useState({}); // { "Basic": 5000, "HRA": 2000 }
    
    // Run Payroll Form
    const [payrollMonth, setPayrollMonth] = useState("January");
    const [payrollYear, setPayrollYear] = useState(2026);

    useEffect(() => {
        dispatch(fetchComponents());
        dispatch(fetchAllEmployees());
        if(user?.empid) {
           dispatch(fetchHistory(user.empid)); 
        }
    }, [dispatch, user]);

    // Toast Timer
    useEffect(() => {
        if(success || error) {
            const timer = setTimeout(() => dispatch(clearMessages()), 3000);
            return () => clearTimeout(timer);
        }
    }, [success, error, dispatch]);

    const handleAddComponent = () => {
        dispatch(addComponent({ name: compName, type: compType }));
        setOpenComponentDialog(false);
        setCompName("");
    }

    const handleRunPayroll = () => {
        dispatch(runPayroll({ month: payrollMonth, year: payrollYear }));
        setOpenPayrollDialog(false);
    }

    const handleAssignSalary = () => {
        dispatch(assignSalary({ empId: selectedEmp, structure: salaryValues }));
        setOpenAssignDialog(false);
        setSalaryValues({});
        setSelectedEmp("");
    }

    const handleValueChange = (name, val) => {
        setSalaryValues(prev => ({ ...prev, [name]: val }));
    }

    const handleDownload = (id) => {
        const link = document.createElement('a');
        link.href = `${BASE_URL}/api/payroll/download/${id}`;
        link.setAttribute('download', `Payslip_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
    };

    const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

    // Columns
    const componentColumns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', width: 200, flex: 1 },
        { field: 'type', headerName: 'Type', width: 150 },
        { field: 'isActive', headerName: 'Status', width: 120, renderCell: (params) => params.value ? 'Active' : 'Inactive' }
    ];

    const historyColumns = [
        { field: 'id', headerName: 'Ref ID', width: 90 },
        { field: 'month', headerName: 'Month', width: 120 },
        { field: 'year', headerName: 'Year', width: 100 },
        { field: 'netPay', headerName: 'Net Pay', width: 150, renderCell: (params) => `$${params.value}` },
        { field: 'status', headerName: 'Status', width: 120 },
        { 
            field: 'action', 
            headerName: 'Action', 
            width: 150,
            renderCell: (params) => (
                <Button 
                    startIcon={<DownloadIcon />} 
                    size="small" 
                    onClick={() => handleDownload(params.row.id)}
                >
                    Download
                </Button>
            )
        }
    ];

  return (
    <Box sx={{ padding: "100px 40px 20px 40px", minHeight: "100vh" }}>
      <Header title="PAYROLL MANAGEMENT" subtitle="Dynamic Salary Structures & Payslip Generation" />

      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)}>
          <Tab icon={<HistoryIcon />} label="Payslip History" />
          {isAdmin && <Tab icon={<SettingsIcon />} label="Configuration & Components" />}
        </Tabs>
      </Box>

      {/* 1. History Tab (For Everyone) */}
      {tabIndex === 0 && (
          <Box>
            {isAdmin && (
                <Stack direction="row" spacing={2} mb={3}>
                    <Button 
                        variant="contained" 
                        color="primary"
                        startIcon={<AttachMoneyIcon />} 
                        onClick={() => setOpenPayrollDialog(true)}
                    >
                        Run Monthly Payroll
                    </Button>
                    <Button 
                        variant="outlined" 
                        startIcon={<MonetizationOnIcon />} 
                        onClick={() => setOpenAssignDialog(true)}
                    >
                        Assign Structure
                    </Button>
                </Stack>
            )}

            <Box height="500px">
                <DataGrid 
                    rows={history || []} 
                    columns={historyColumns}
                    pageSize={10}
                    disableSelectionOnClick
                />
            </Box>
          </Box>
      )}

      {/* 2. Configuration Tab (Admin Only) */}
      {tabIndex === 1 && isAdmin && (
          <Box>
             <Box display="flex" gap={2} mb={2}>
                 <Button variant="contained" onClick={() => setOpenComponentDialog(true)}>
                     Add Salary Head
                 </Button>
             </Box>
             <Typography variant="h6" gutterBottom>Salary Components Master List</Typography>
             <Box height="400px">
                <DataGrid 
                    rows={components || []} 
                    columns={componentColumns}
                    pageSize={10}
                    disableSelectionOnClick
                />
             </Box>
          </Box>
      )}

      {/* DIALOG: Add Component */}
      <Dialog open={openComponentDialog} onClose={() => setOpenComponentDialog(false)}>
          <DialogTitle>Add Salary Component</DialogTitle>
          <DialogContent>
              <TextField 
                label="Name (e.g., Travel Allowance)" 
                fullWidth 
                margin="dense"
                value={compName}
                onChange={(e) => setCompName(e.target.value)}
              />
              <FormControl fullWidth margin="dense">
                  <InputLabel>Type</InputLabel>
                  <Select value={compType} label="Type" onChange={(e) => setCompType(e.target.value)}>
                      <MenuItem value="earning">Earning</MenuItem>
                      <MenuItem value="deduction">Deduction</MenuItem>
                  </Select>
              </FormControl>
          </DialogContent>
          <DialogActions>
              <Button onClick={() => setOpenComponentDialog(false)}>Cancel</Button>
              <Button onClick={handleAddComponent} variant="contained">Add</Button>
          </DialogActions>
      </Dialog>

      {/* DIALOG: Assign Salary */}
      <Dialog open={openAssignDialog} onClose={() => setOpenAssignDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Assign Salary Structure</DialogTitle>
          <DialogContent>
              <FormControl fullWidth margin="dense">
                  <InputLabel>Select Employee</InputLabel>
                  <Select 
                    value={selectedEmp} 
                    label="Select Employee" 
                    onChange={(e) => setSelectedEmp(e.target.value)}
                  >
                        {employeesList.map(emp => (
                            <MenuItem key={emp.empId} value={emp.empId}>{emp.name || emp.username} ({emp.empId})</MenuItem>
                        ))}
                  </Select>
              </FormControl>
              
              <Typography variant="subtitle1" mt={2} mb={1}>Enter Annual/Monthly Values</Typography>
              {components.map(comp => (
                  <TextField 
                    key={comp.id}
                    label={comp.name}
                    type="number"
                    fullWidth 
                    margin="dense"
                    helperText={comp.type.toUpperCase()}
                    onChange={(e) => handleValueChange(comp.name, e.target.value)}
                  />
              ))}
          </DialogContent>
          <DialogActions>
              <Button onClick={() => setOpenAssignDialog(false)}>Cancel</Button>
              <Button onClick={handleAssignSalary} variant="contained" disabled={!selectedEmp}>Assign</Button>
          </DialogActions>
      </Dialog>

      {/* DIALOG: Run Payroll */}
      <Dialog open={openPayrollDialog} onClose={() => setOpenPayrollDialog(false)}>
          <DialogTitle>Run Payroll Generation</DialogTitle>
          <DialogContent>
              <Typography variant="body2" color="textSecondary" mb={2}>
                  This will generate payslips based on Attendance & Structure.
                  LOP (Loss of Pay) will be auto-calculated for absent days.
              </Typography>
              <TextField 
                  label="Month (e.g., January)" 
                  fullWidth margin="dense" 
                  value={payrollMonth} onChange={(e) => setPayrollMonth(e.target.value)}
              />
               <TextField 
                  label="Year" 
                  type="number"
                  fullWidth margin="dense" 
                  value={payrollYear} onChange={(e) => setPayrollYear(e.target.value)}
              />
          </DialogContent>
          <DialogActions>
              <Button onClick={() => setOpenPayrollDialog(false)}>Cancel</Button>
              <Button onClick={handleRunPayroll} variant="contained" color="success">Generate</Button>
          </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Payroll;
