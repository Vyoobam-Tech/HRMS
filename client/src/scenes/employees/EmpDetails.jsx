import React, { useEffect, useState } from 'react'
import { Box } from '@mui/system'
import CloseIcon from "@mui/icons-material/Close";
import { Card, CardContent, Divider, Typography, Grid, Button, Dialog, DialogContent, DialogTitle, IconButton, DialogActions, TextField, Checkbox, FormControlLabel} from '@mui/material'
import EmployeeForm from './EmployeeForm'
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployeeByEmail, updateEmployee } from '../../features/employeeSlice';
import { fetchProfile } from '../../features/auth/authSlice';

const EmpDetails = () => {

  const [open, setOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)

  const dispatch = useDispatch()

  const { user, loading: authLoading, error: authError } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const {single: employee, loading, error} = useSelector((state) =>
  state.employee
  )

  useEffect(() => {
    if(user?.email) {
      dispatch(fetchEmployeeByEmail(user.email))
    }
  }, [user, dispatch])

  const handleAdd = () => {
    if (employee) return
    setSelectedRow({})
    setOpen(true)
  }

  const handleEdit = () => {
    if (!employee) return
    setSelectedRow(employee)
    setShowEditModal(true)
  }

  const handleSave = async () => {
    if(!selectedRow) return
    try{
      await dispatch(updateEmployee({empId: selectedRow.empId, data: selectedRow}))
      setShowEditModal(false)
    }catch(err){
      console.log("Update failed:", err);
    }
  }
  

  const InfoItem = ({ label, value }) => (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 1,
        bgcolor: 'grey.50',
        border: '1px solid',
        borderColor: 'grey.200',
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600}>
        {value || "-"}
      </Typography>
    </Box>
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
      <Box sx={{ display: "flex",  }}>
        <Button variant='contained' color='primary' sx={{ mb: 2 }} onClick={handleAdd} disabled={!!employee}>
          Add
        </Button>

        <Button
          variant='contained'
          color='secondary'
          sx={{ mb:2, ml: 2}}
          onClick={handleEdit}
          disabled={!employee}
        >
          Edit
        </Button>

      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle sx={{ color: 'white', bgcolor: '#1976D2', display: "flex", alignItems: "center", justifyContent: "space-between" }}>Add Details
          <IconButton onClick={() => setOpen(false)} color="dark">
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <EmployeeForm setOpen={setOpen}/>
        </DialogContent>
      </Dialog>

      <Box>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Personal Information
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            {[
              ["Emp ID", user?.empid],
              ["Name", employee?.name],
              ["Email", user?.email],
              ["Official Email", employee?.personalEmail],
              ["Contact", employee?.contact],
              ["Father Name", employee?.fatherName],
              ["Mother Name", employee?.motherName],
              ["Occupation", employee?.occupation],
              ["Parent Contact", employee?.faormoNumber],
              ["Permanent Address", employee?.permanentAddress],
              ["Communication Address", employee?.communicationAddress],
              ["Gender", employee?.gender],
              ["Date of Birth", employee?.dob],
              ["Blood Group", employee?.bloodGroup],
              ["Marital Status", employee?.maritalStatus],
              ["Spouse Name", employee?.spouseName],
              ["Aadhaar", employee?.aadhaar],
              ["PAN", employee?.pan],
            ].map(([label, value]) => (
              <Grid item xs={12} sm={6} md={4} key={label}>
                <InfoItem label={label} value={value} />
              </Grid>
            ))}
          </Grid>

        </CardContent>
      </Card>

        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant='h6' gutterBottom sx={{ fontWeight: 600  }}>
              Educational Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {[
                  ["10th Board", employee?.tenthBoard],
                  ["Year Of Passing", employee?.tenthYearofPassing],
                  ["Percentage", employee?.tenthPercentage],
                  ["12th Board", employee?.twelveBoard],
                  ["Year Of Passing", employee?.twelveYearofPassing],
                  ["Percentage", employee?.twelvePercentage],
                  ["UG University", employee?.ugUniversity],
                  ["Year Of Passing", employee?.ugYearofPassing],
                  ["Percentage", employee?.ugPercentage],
                  ["PG University", employee?.pgUniversity],
                  ["Year Of Passing", employee?.pgYearofPassing],
                  ["Percentage", employee?.pgPercentage]
                ].map(([label,value]) => (
                  <Grid item xs={12} sm={6} md={4} key={label}>
                    <InfoItem label={label} value={value} />
                  </Grid>
                ))}
              </Grid>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant='h6' gutterBottom sx={{ fontWeight: 600 }}>
              Bank Details
            </Typography>
            <Divider sx={{ mb:2 }}/>
            <Grid container spacing={2}>
                {[
                  ["Bank Name", employee?.bankName],
                  ["Account Number", employee?.accountNumber],
                  ["IFSC Code", employee?.ifscCode],
                  ["Branch", employee?.branch],
                ].map(([label, value]) => (
                  <Grid item xs={12} sm={6} md={4} key={label}>
                    <InfoItem label={label} value={value} />
                  </Grid>
                ))}
            </Grid>
          </CardContent>
        </Card>

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
          <DialogTitle>Edit Employee</DialogTitle>
          <IconButton onClick={() => setShowEditModal(false)} color="dark">
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        </div>

          {selectedRow && (
            <div className="modal-body" style={{ padding: "16px" }}>
              <DialogContent>
                <TextField
                  label="Employee ID"
                  fullWidth
                  margin="dense"
                  value={selectedRow.empId || ""}
                  disabled
                />

                <TextField
                  label="Employee Name"
                  fullWidth
                  margin="dense"
                  value={selectedRow.name || ""}
                  onChange={(e) =>
                    setSelectedRow({ ...selectedRow, name: e.target.value })
                  }
                />
                <TextField
                  label="Email"
                  fullWidth
                  margin="dense"
                  value={selectedRow.email || ""}
                  disabled
                />

                <TextField
                  label="Official Email"
                  fullWidth
                  margin="dense"
                  value={selectedRow.personalEmail || ""}
                  onChange={(e) =>
                    setSelectedRow({ ...selectedRow, personalEmail: e.target.value })
                  }
                />
                <TextField
                  label="Contact"
                  fullWidth
                  margin="dense"
                  value={selectedRow.contact || ""}
                  onChange={(e) =>
                    setSelectedRow({ ...selectedRow, contact: e.target.value })
                  }
                />
                <TextField
                  label="Father Name"
                  fullWidth
                  margin="dense"
                  value={selectedRow.fatherName || ""}
                  onChange={(e) => setSelectedRow({ ...selectedRow, fatherName: e.target.value })}
                />
                <TextField
                  label="Mother Name"
                  fullWidth
                  margin="dense"
                  value={selectedRow.motherName || ""}
                  onChange={(e) => setSelectedRow({ ...selectedRow, motherName: e.target.value })}
                />
                <TextField
                  label="Occupation"
                  fullWidth
                  margin="dense"
                  value={selectedRow.occupation || ""}
                  onChange={(e) => setSelectedRow({ ...selectedRow, occupation: e.target.value })}
                />
                <TextField
                  label="Permanent Address"
                  fullWidth
                  margin="dense"
                  value={selectedRow.permanentAddress || ""}
                  onChange={(e) => setSelectedRow({ ...selectedRow, permanentAddress: e.target.value })}
                />
                <TextField
                  label="Communication Address"
                  fullWidth
                  margin="dense"
                  value={selectedRow.communicationAddress || ""}
                  onChange={(e) => setSelectedRow({ ...selectedRow, communicationAddress: e.target.value })}
                />
                <TextField
                  label="DOB"
                  type="date"
                  fullWidth
                  margin="dense"
                  value={selectedRow.dob || ""}
                  onChange={(e) => setSelectedRow({ ...selectedRow, dob: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Gender"
                  fullWidth
                  margin="dense"
                  value={selectedRow.gender || ""}
                  onChange={(e) => setSelectedRow({ ...selectedRow, gender: e.target.value })}
                />
                <TextField
                  label="Blood Group"
                  fullWidth
                  margin="dense"
                  value={selectedRow.bloodGroup || ""}
                  onChange={(e) => setSelectedRow({ ...selectedRow, bloodGroup: e.target.value })}
                />
                <TextField
                  label="Marital Status"
                  fullWidth
                  margin="dense"
                  value={selectedRow.maritalStatus || ""}
                  onChange={(e) => setSelectedRow({ ...selectedRow, maritalStatus: e.target.value })}
                />
                <TextField
                  label="Spouse Name"
                  fullWidth
                  margin="dense"
                  value={selectedRow.spouseName || ""}
                  onChange={(e) => setSelectedRow({ ...selectedRow, spouseName: e.target.value })}
                />
                <TextField
                  label="Aadhaar"
                  fullWidth
                  margin="dense"
                  value={selectedRow.aadhaar || ""}
                  onChange={(e) => setSelectedRow({ ...selectedRow, aadhaar: e.target.value })}
                />
                <TextField
                  label="PAN"
                  fullWidth
                  margin="dense"
                  value={selectedRow.pan || ""}
                  onChange={(e) => setSelectedRow({ ...selectedRow, pan: e.target.value })}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedRow.isOvertimeEnabled || false}
                      onChange={(e) => setSelectedRow({ ...selectedRow, isOvertimeEnabled: e.target.checked })}
                    />
                  }
                  label="Enable Overtime Calculation"
                />

                <TextField
                  label="10th Board"
                  fullWidth
                  margin="dense"
                  value={selectedRow.tenthBoard || ""}
                  onChange={(e) => setSelectedRow({ ...selectedRow, tenthBoard: e.target.value })}
                />
                <TextField
                  label="10th Year of Passing"
                  fullWidth
                  margin="dense"
                  value={selectedRow.tenthYearofPassing || ""}
                  onChange={(e) => setSelectedRow({ ...selectedRow, tenthYearofPassing: e.target.value })}
                />
                <TextField
                  label="10th Percentage"
                  fullWidth
                  margin="dense"
                  value={selectedRow.tenthPercentage || ""}
                  onChange={(e) => setSelectedRow({ ...selectedRow, tenthPercentage: e.target.value })}
                />

                <TextField
                  label="12th Board"
                  fullWidth
                  margin="dense"
                  value={selectedRow.twelveBoard || ""}
                  onChange={(e) => setSelectedRow({ ...selectedRow, twelveBoard: e.target.value })}
                />
                <TextField
                  label="12th Year of Passing"
                  fullWidth
                  margin="dense"
                  value={selectedRow.twelveYearofPassing || ""}
                  onChange={(e) => setSelectedRow({ ...selectedRow, twelveYearofPassing: e.target.value })}
                />
                <TextField
                  label="12th Percentage"
                  fullWidth
                  margin="dense"
                  value={selectedRow.twelvePercentage || ""}
                  onChange={(e) => setSelectedRow({ ...selectedRow, twelvePercentage: e.target.value })}
                />

                <TextField
                  label="UG University"
                  fullWidth
                  margin="dense"
                  value={selectedRow.ugUniversity || ""}
                  onChange={(e) => setSelectedRow({ ...selectedRow, ugUniversity: e.target.value })}
                />
                <TextField
                  label="UG Year of Passing"
                  fullWidth
                  margin="dense"
                  value={selectedRow.ugYearofPassing || ""}
                  onChange={(e) => setSelectedRow({ ...selectedRow, ugYearofPassing: e.target.value })}
                />
                <TextField
                  label="UG Percentage"
                  fullWidth
                  margin="dense"
                  value={selectedRow.ugPercentage || ""}
                  onChange={(e) => setSelectedRow({ ...selectedRow, ugPercentage: e.target.value })}
                />

                <TextField
                  label="PG University"
                  fullWidth
                  margin="dense"
                  value={selectedRow.pgUniversity || ""}
                  onChange={(e) => setSelectedRow({ ...selectedRow, pgUniversity: e.target.value })}
                />
                <TextField
                  label="PG Year of Passing"
                  fullWidth
                  margin="dense"
                  value={selectedRow.pgYearofPassing || ""}
                  onChange={(e) => setSelectedRow({ ...selectedRow, pgYearofPassing: e.target.value })}
                />
                <TextField
                  label="PG Percentage"
                  fullWidth
                  margin="dense"
                  value={selectedRow.pgPercentage || ""}
                  onChange={(e) => setSelectedRow({ ...selectedRow, pgPercentage: e.target.value })}
                />
                {/* Repeat similarly for 12th, UG, PG */}

                {/* Bank Details */}
                <TextField
                  label="Bank Name"
                  fullWidth
                  margin="dense"
                  value={selectedRow.bankName || ""}
                  onChange={(e) => setSelectedRow({ ...selectedRow, bankName: e.target.value })}
                />
                <TextField
                  label="Account Number"
                  fullWidth
                  margin="dense"
                  value={selectedRow.accountNumber || ""}
                  onChange={(e) => setSelectedRow({ ...selectedRow, accountNumber: e.target.value })}
                />
                <TextField
                  label="IFSC Code"
                  fullWidth
                  margin="dense"
                  value={selectedRow.ifscCode || ""}
                  onChange={(e) => setSelectedRow({ ...selectedRow, ifscCode: e.target.value })}
                />
                <TextField
                  label="Branch"
                  fullWidth
                  margin="dense"
                  value={selectedRow.branch || ""}
                  onChange={(e) => setSelectedRow({ ...selectedRow, branch: e.target.value })}
                />
              </DialogContent>
            </div>
          )}

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
              color="error"
              variant="outlined"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} color="primary" variant="outlined">
              Save
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </Box>
    </div>
  )
}

export default EmpDetails