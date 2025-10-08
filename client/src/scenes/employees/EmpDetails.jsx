import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Box } from '@mui/system'
import { Card, CardContent, Divider, Typography, Grid, Button, Dialog, DialogContent, DialogTitle} from '@mui/material'
import EmployeeForm from './EmployeeForm'

const EmpDetails = () => {

  const [user, setUser] = useState(null)
  const [employee, setEmployee] = useState(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try{
        const response = await axios.get("http://localhost:3000/auth/profile", {withCredentials: true})

        if(response.data.status) {
          setUser(response.data.user)
        }
      } catch(err) {
        console.log(err)
      }
    }
    fetchProfile()
  }, [])

  useEffect(() => {
    const fetchEmployee = async () => {
      if(!user?.email) return
      try{
        const response = await axios.get(`http://localhost:3000/api/employees/by-user/${user.email}`, 
          {withCredentials: true})
        if(response.data.status){
          setEmployee(response.data.data)
        }
      } catch(err) {
        console.log(err)
      }
    }
    fetchEmployee()
  }, [user])

  return (
    <div
      style={{
        height: 450,
        width: "100%",
        marginRight: "60px",
        paddingTop: "100px",
        marginLeft: "20px",
      }}
    >
      <Button variant='contained' color='primary' sx={{ mb: 2 }} onClick={() => setOpen(true)}>
        Add Details
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle sx={{ color: 'white', bgcolor: '#1976D2' }}>Add Details</DialogTitle>
        <DialogContent>
          <EmployeeForm />
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
                  <Typography component="span" sx={{ fontWeight: 600 }}>{label} : {""}</Typography>
                  <Typography component="span">{value || "-"}</Typography>
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
                    <Box sx={{ mb: 1 }}>
                      <Typography component="span" sx={{ fontWeight: 600 }}>{label} : {""}</Typography>
                      <Typography component="span">{value || "-"}</Typography>
                    </Box>
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
                    <Typography component="span" sx={{ fontWeight: 600 }}>{label} : {""}</Typography>
                    <Typography component="span">{value}</Typography>
                  </Grid>
                ))}
            </Grid>
          </CardContent>
        </Card>
    </Box>
    </div>
  )
}

export default EmpDetails