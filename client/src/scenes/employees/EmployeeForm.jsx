import { Box, Button, MenuItem, Step, StepLabel, Stepper, TextField, Grid, Typography, RadioGroup, FormControlLabel, FormLabel, Radio, Card } from '@mui/material'
import {  margin, width } from '@mui/system'
import React, { useState } from 'react'

const steps = ["Personal Details", "Educational Details", "Work Experience (if any)", "Bank Details", "Preview & Submit"]

const EmployeeForm = () => {

    const [activeStep, setActiveStep] = useState(0)
    const [formData, setFormData] =useState({
        empId: "",
        name: "",
        gender: "",
        dob: "",
        bloodGroup: "",
        maritalStatus: "",
        spouseName: "",
        spouseNumber: "",
        contact: "",
        email: "",
        fatherName: "",
        motherName: "",
        occupation: "",
        faormoNumber: "",
        permanentAddress: "",
        communicationAddress: "",
        aadhaar: "",
        pan: "",

        tenthBoard: "",
        tenthYearofPassing: "",
        tenthPercentage: "",

        twelveBoard: "",
        twelveYearofPassing: "",
        twelvePercentage: "",

        ugUniversity: "",
        ugYearofPaasing: "",
        ugPercentage: "",

        pgUniversity: "",
        pgYearofPaasing: "",
        pgPercentage: "",

        hasExperience: true,
        experiences: [
            {
                company: "",
                title: "",
                startDate: "",
                endDate: "",
                description: "",
                skills: "",
            }
        ],


        bankName: "",
        accountNumber: "",
        ifscCode: "",
        branch: ""
        })

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleExperienceChange = (index, field, value) => {
        const updated = [...formData.experiences]
        updated[index][field] = value
        setFormData({...formData, experiences: updated})
    }

    const handleNext = () => {
        if (activeStep < steps.length - 1){
            setActiveStep((prev) => prev + 1)
        } else {
            console.log("submitted", formData)
        }
    }

    const handleBack = () => {
        setActiveStep((prev) => prev - 1)
    }

    const renderStep = (step) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Employee ID"
                                name="empId"
                                value={formData.empId || ""}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="name"
                                value={formData.name || ""}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                value={formData.email || ""}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Contact Number"
                                name="contact"
                                value={formData.contact || ""}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Father Name"
                                name="fatherName"
                                value={formData.fatherName || ""}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Mother Name"
                                name="motherName"
                                value={formData.motherName || ""}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Occupation"
                                name="occupation"
                                value={formData.occupation || ""}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Father/Mother Number"
                                name="faormoNumber"
                                value={formData.faormoNumber || ""}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Permanent Address"
                                name="permanentAddress"
                                value={formData.permanentAddress || ""}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Communication Address"
                                name="communicationAddress"
                                value={formData.communicationAddress || ""}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                fullWidth
                                label="Gender"
                                name="gender"
                                value={formData.gender || ""}
                                onChange={handleChange}
                            >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="date"
                                fullWidth
                                label="Date of Birth"
                                name="dob"
                                value={formData.dob || ""}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                fullWidth
                                label="Blood Group"
                                name="bloodGroup"
                                value={formData.bloodGroup || ""}
                                onChange={handleChange}
                            >
                            <MenuItem value="A+">A+</MenuItem>
                            <MenuItem value="A-">A-</MenuItem>
                            <MenuItem value="B+">B+</MenuItem>
                            <MenuItem value="B-">B-</MenuItem>
                            <MenuItem value="AB+">AB+</MenuItem>
                            <MenuItem value="AB-">AB-</MenuItem>
                            <MenuItem value="O+">O+</MenuItem>
                            <MenuItem value="O-">O-</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                fullWidth
                                label="Marital Status"
                                name="maritalStatus"
                                value={formData.maritalStatus || ""}
                                onChange={handleChange}
                            >
                            <MenuItem value="Single">Single</MenuItem>
                            <MenuItem value="Married">Married</MenuItem>
                            </TextField>
                        </Grid>

                        {formData.maritalStatus === "Married" && (
                            <>
                                <Grid item xs={12} sm={6}>
                                    <TextField 
                                        fullWidth
                                        label="Spouse Name"
                                        name='spouseName'
                                        value={formData.spouseName || ""}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Spouse Contact Number"
                                        name="spouseContact"
                                        value={formData.spouseContact || ""}
                                        onChange={handleChange}
                                    />
                                </Grid>
                            </>
                        )}

                        <Grid item xs={12}>
                            <TextField
                            fullWidth
                            label="Aadhaar Number"
                            name="aadhaar"
                            value={formData.aadhaar || ""}
                            onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                            fullWidth
                            label="PAN Number"
                            name="pan"
                            value={formData.pan || ""}
                            onChange={handleChange}
                            />
                        </Grid>
                    </Grid>

                )


                case 1: 
                    return (
                        <Grid container spacing={2}>
                            <Grid item xs={12} >
                                <Typography>10th</Typography>
                                <TextField 
                                fullWidth label="Board / University" 
                                name="tenthBoard" 
                                value={formData.tenthBoard} 
                                onChange={handleChange} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography>Year Of Passing</Typography>
                                <TextField 
                                fullWidth 
                                name="tenthYearofPassing" 
                                value={formData.tenthYearofPassing} 
                                onChange={handleChange} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography>Percentage / CGPA</Typography>
                                <TextField 
                                fullWidth 
                                name="tenthPercentage" 
                                value={formData.tenthPercentage} 
                                onChange={handleChange} />
                            </Grid>

                            <Grid item xs={12} >
                                <Typography>12th</Typography>
                                <TextField 
                                fullWidth label="Board / University" 
                                name="twelveBoard" 
                                value={formData.twelveBoard} 
                                onChange={handleChange} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography>Year Of Passing</Typography>
                                <TextField 
                                fullWidth 
                                name="twelveYearofPassing" 
                                value={formData.twelveYearofPassing} 
                                onChange={handleChange} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography>Percentage / CGPA</Typography>
                                <TextField 
                                fullWidth name="twelvePercentage" 
                                value={formData.twelvePercentage} 
                                onChange={handleChange} />
                            </Grid>

                            <Grid item xs={12} >
                                <Typography>UG</Typography>
                                <TextField 
                                fullWidth label="Board / University" 
                                name="ugUniversity" 
                                value={formData.ugUniversity} 
                                onChange={handleChange} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography>Year Of Passing</Typography>
                                <TextField 
                                fullWidth 
                                name="ugYearofPaasing" 
                                value={formData.ugYearofPaasing} 
                                onChange={handleChange} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography>Percentage / CGPA</Typography>
                                <TextField 
                                fullWidth 
                                name="ugPercentage" 
                                value={formData.ugPercentage} 
                                onChange={handleChange} />
                            </Grid>

                            <Grid item xs={12} >
                                <Typography>PG</Typography>
                                <TextField 
                                fullWidth label="Board / University" 
                                name="pgUniversity" 
                                value={formData.pgUniversity} 
                                onChange={handleChange} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography>Year Of Passing</Typography>
                                <TextField 
                                fullWidth 
                                name="pgYearofPaasing" 
                                value={formData.pgYearofPaasing} 
                                onChange={handleChange} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography>Percentage / CGPA</Typography>
                                <TextField 
                                fullWidth 
                                name="pgPercentage" 
                                value={formData.pgPercentage} 
                                onChange={handleChange} />
                            </Grid>
                        </Grid>
                    )

                case 2:
                    return (
                        <Grid container spacing={2}>
                            <FormLabel>Do you have previous work experiences?</FormLabel>
                            <RadioGroup
                                row
                                value={formData.hasExperience ? "yes" : "no"}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        hasExperience: e.target.value === "yes"
                                    })
                                }}
                            > 
                                <FormControlLabel value="yes" label="Yes" control={<Radio />}/>
                                <FormControlLabel value="no" label="No" control={<Radio />}/>
                            </RadioGroup>

                            {formData.hasExperience && (
                                formData.experiences.map((exp, index) => (
                                    <Grid
                                    key={index}
                                    container
                                    spacing={2}
                                    sx={{ mb:3, borderRadius: 2, p: 2 }}
                                    >
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                            fullWidth
                                            label='Company Name'
                                            value={exp.company}
                                            onChange={(e) => 
                                                handleExperienceChange(index, "company", e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                            fullWidth
                                            label='Job Title'
                                            value={exp.title}
                                            onChange={(e) => 
                                                handleExperienceChange(index, "title", e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                            fullWidth
                                            type='date'
                                            label='Start Date'
                                            InputLabelProps={{ shrink: true }}
                                            value={exp.startDate}
                                            onChange={(e) => 
                                                handleExperienceChange(index, "startDate", e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                            fullWidth
                                            type='date'
                                            label='End Date'
                                            InputLabelProps={{ shrink: true }}
                                            value={exp.endDate}
                                            onChange={(e) => 
                                                handleExperienceChange(index, "endDate", e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                            fullWidth
                                            multiline
                                            rows={3}
                                            label='Description '
                                            value={exp.description}
                                            onChange={(e) => 
                                                handleExperienceChange(index, "description", e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                            fullWidth
                                            label='Skills'
                                            value={exp.skills}
                                            onChange={(e) => 
                                                handleExperienceChange(index, "skills", e.target.value)}
                                            />
                                        </Grid>
                                    </Grid>
                                ))
                            )}

                            {formData.hasExperience && (
                                <Grid item xs={12}>
                                    <Button
                                    variant='outlined'
                                    onClick={() => {
                                        setFormData({
                                            ...formData,
                                            experiences: [
                                                ...formData.experiences,
                                                {
                                                    company: "",
                                                    title: "",
                                                    startDate: "",
                                                    endDate: "",
                                                    description: "",
                                                    skills: "",
                                                }
                                            ]
                                        })
                                    }}
                                    >
                                        Add Another Experience
                                    </Button>
                                </Grid>
                            )}
                        </Grid>
                    )

                case 3:
                    return (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                fullWidth
                                label="Bank Name"
                                name='bankName'
                                value={formData.bankName}
                                onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                fullWidth
                                label="Account Number"
                                name='accountNumber'
                                value={formData.accountNumber}
                                onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                fullWidth
                                label="IFSC Code"
                                name='ifscCode'
                                value={formData.ifscCode}
                                onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                fullWidth
                                label="Branch"
                                name='branch'
                                value={formData.branch}
                                onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                    )


                default :
                    return null
        }
    }

  return (
    <Box sx={{ width: "80%", margin: "auto", mt:5 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
                <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                </Step>
            ))}
        </Stepper>

        <Box sx={{ mt: 4 }}>
            {renderStep(activeStep)}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "end", mt: 4 }}>
            <Button disabled={activeStep === 0} onClick={handleBack}>
                Back
            </Button>
            <Button variant='contained' onClick={handleNext}>
                {activeStep === steps.length -1 ? "Submit" : "Next"}
            </Button>
        </Box>
    </Box>
  )
}

export default EmployeeForm
