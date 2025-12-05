import { Box, Button, MenuItem, Step, StepLabel, Stepper, TextField, Grid, Typography, RadioGroup, FormControlLabel, FormLabel, Radio, Card, Divider, Checkbox } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axiosInstance'

const steps = ["Personal Details", "Educational Details", "Work Experience (if any)", "Bank Details", "Preview & Submit"]

const EmployeeForm = ({setOpen}) => {

    const [user, setuser] = useState(null)
    const [activeStep, setActiveStep] = useState(0)
    const [formData, setFormData] =useState({
        empId: "",
        name: "",
        email: "",
        contact: "",
        fatherName: "",
        motherName: "",
        occupation: "",
        faormoNumber: "",
        permanentAddress: "",
        communicationAddress: "",
        gender: "",
        dob: "",
        bloodGroup: "",
        maritalStatus: "",
        spouseName: "",
        spouseContact: "",
        aadhaar: "",
        pan: "",

        tenthBoard: "",
        tenthYearofPassing: "",
        tenthPercentage: "",

        twelveBoard: "",
        twelveYearofPassing: "",
        twelvePercentage: "",

        ugUniversity: "",
        ugYearofPassing: "",
        ugPercentage: "",

        pgUniversity: "",
        pgYearofPassing: "",
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

        useEffect(() => {
            const fetchProfile = async () => {
                try{
                    const response = await API.get("/auth/profile")

                    if(response.data.status){
                        setuser(response.data.user)
                    }
                } catch(err){
                    console.log(err)
                }
            }
            fetchProfile()
        }, [])

        const validate = () => {
            const errors ={}

            if(activeStep === 0) {
                if (!formData.name) {
                errors.name = "Father Name is required";
                } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
                errors.name = "Name must contain only letters";
                }
                if(!formData.contact) errors.contact = "Contact is required";
                else if(!/^\d{10}$/.test(formData.contact)) errors.contact = "Must be 10 digits"
                if (!formData.fatherName) {
                errors.fatherName = "Father Name is required";
                } else if (!/^[A-Za-z\s]+$/.test(formData.fatherName)) {
                errors.fatherName = "Father Name must contain only letters";
                }
                if (!formData.motherName) {
                errors.motherName = "Mother Name is required";
                } else if (!/^[A-Za-z\s]+$/.test(formData.motherName)) {
                errors.motherName = "Mother Name must contain only letters";
                }
                if(!formData.faormoNumber) errors.faormoNumber = "Parent Number is required"
                else if(!/^\d{10}$/.test(formData.faormoNumber)) errors.faormoNumber = "Must be 10 digits"
                if(!formData.occupation) errors.occupation = "Occupation is required"
                if(!formData.permanentAddress) errors.permanentAddress = "Permanent Address is required"
                if(!formData.communicationAddress) errors.communicationAddress = "Communication Address is required"
                if(!formData.gender) errors.gender = "Gender is required"
                if(!formData.dob) errors.dob = "Date of Birth is required"
                if(!formData.bloodGroup) errors.bloodGroup = "Blood Group is required"
                if(!formData.maritalStatus) errors.maritalStatus = "Marital Status is required"
                if(formData.maritalStatus === "Married") {
                    if(!formData.spouseName) errors.spouseName = "Spouse Name is required"
                    if(!formData.spouseContact) errors.spouseContact = "Spouse Contact is required"
                }
                if(!formData.aadhaar) errors.aadhaar = "Aadhaar Number is required"
                else if(!/^\d{12}$/.test(formData.aadhaar)) errors.aadhaar = "Invalid Aadhaar Number"

                if(!formData.pan) errors.pan = "PAN Number is required"
                else if(!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(formData.pan)) errors.pan = "Invalid PAN Number"

            }

            if(activeStep === 1) {
                if (!formData.tenthBoard) {
                errors.tenthBoard = "10th Board is required";
                } else if (!/^[A-Za-z\s]+$/.test(formData.tenthBoard)) {
                errors.tenthBoard = "10th Board must contain only letters"
                }

                if(!formData.tenthYearofPassing) errors.tenthYearofPassing = "10th Year is required"
                else if(!/^\d{4}$/.test(formData.tenthYearofPassing)) errors.tenthYearofPassing = "Invalid"
                if(!formData.tenthPercentage) errors.tenthPercentage = "10th Percentage is required"
                else if(!/^\d{1,2}%?$/.test(formData.tenthPercentage)) errors.tenthPercentage = "Invalid"

                if (!formData.twelveBoard) {
                errors.twelveBoard = "12th Board is required";
                } else if (!/^[A-Za-z\s]+$/.test(formData.twelveBoard)) {
                errors.twelveBoard = "12th Board must contain only letters"
                }
                if(!formData.twelveYearofPassing) errors.twelveYearofPassing = "12th Year is required"
                else if(!/^\d{4}$/.test(formData.twelveYearofPassing)) errors.twelveYearofPassing = "Invalid"
                if(!formData.twelvePercentage) errors.twelvePercentage = "12th Percentage is required"
                else if(!/^\d{1,2}%?$/.test(formData.twelvePercentage)) errors.twelvePercentage = "Invalid"

                if (!formData.ugUniversity) {
                errors.ugUniversity = "Ug University is required";
                } else if (!/^[A-Za-z\s]+$/.test(formData.ugUniversity)) {
                errors.ugUniversity = "Ug University must contain only letters"
                }
                if(!formData.ugYearofPassing) errors.ugYearofPassing = "UG Year is required"
                else if(!/^\d{4}$/.test(formData.ugYearofPassing)) errors.ugYearofPassing = "Invalid"
                if(!formData.ugPercentage) errors.ugPercentage = "UG Percentage is required"
                else if(!/^\d{1,2}%?$/.test(formData.ugPercentage)) errors.ugPercentage = "Invalid"

                if (formData.pgUniversity) {
                    if (!/^[A-Za-z\s]+$/.test(formData.pgUniversity)) {
                        errors.pgUniversity = "PG University must contain only letters";
                    }
                }
                if (formData.pgYearofPassing) {
                    if (!/^\d{4}$/.test(formData.pgYearofPassing)) {
                        errors.pgYearofPassing = "Invalid";
                    }
                }
                if (formData.pgPercentage) {
                    if (!/^\d{1,2}%?$/.test(formData.pgPercentage)) {
                        errors.pgPercentage = "Invalid";
                    }
                }
            }

            if(activeStep === 2) {
                if(formData.hasExperience) {
                    formData.experiences.forEach((exp, index) => {
                        if (!exp.company) {
                        errors[`experiences.${index}.company`] = "Company Name is required";
                        } else if (!/^[A-Za-z\s]+$/.test(exp.company)) {
                        errors[`experiences.${index}.company`] = "Company Name must contain only letters";
                        }
                        if (!exp.title) {
                        errors[`experiences.${index}.title`] = "Job Title is required";
                        } else if (!/^[A-Za-z\s]+$/.test(exp.title)) {
                        errors[`experiences.${index}.title`] = "Job Title must contain only letters";
                        }
                        if(!exp.startDate) {
                            errors[`experiences.${index}.startDate`] = "Start Date is required"
                        }
                        if(!exp.endDate) {
                            errors[`experiences.${index}.endDate`] = "End Date is required"
                        }
                        if(!exp.description) {
                            errors[`experiences.${index}.description`] = "Description is required"
                        }
                        if (!exp.skills) {
                        errors[`experiences.${index}.skills`] = "Skills is required";
                        } else if (!/^[A-Za-z\s,]+$/.test(exp.skills)) {
                        errors[`experiences.${index}.skills`] = "Skills must contain only letters";
                        }

                    })
                }
            }

            if(activeStep === 3) {
                if (!formData.bankName) {
                errors.bankName = "Bank Name is required";
                } else if (!/^[A-Za-z\s]+$/.test(formData.bankName)) {
                errors.bankName = "Bank Name must contain only letters";
                }

                if(!formData.accountNumber) {
                    errors.accountNumber = "Account Number is required"
                } else if(!/^\d+$/.test(formData.accountNumber)) {
                    errors.accountNumber = "Account Number must be numbers only"
                } else if(formData.accountNumber.length < 9 || formData.accountNumber.length > 18) {
                    errors.accountNumber = "Account Number must be 9 to 18 digits"
                }

                if (!formData.ifscCode) {
                errors.ifscCode = "IFSC Code is required";
                } else if (!/^[A-Za-z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
                errors.ifscCode = "Invalid IFSC Code format (Example: IDIB000P036)";
                }

                if (!formData.branch) {
                errors.branch = "Branch is required";
                } else if (!/^[A-Za-z\s]+$/.test(formData.branch)) {
                errors.branch = "Branch must contain only letters";
                }

            }

        setErrors(errors);
        return Object.keys(errors).length === 0;
        }


        const initialFormData = {
                empId: "",
                name: "",
                gender: "",
                dob: "",
                bloodGroup: "",
                maritalStatus: "",
                spouseName: "",
                spouseContact: "",
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
                ugYearofPassing: "",
                ugPercentage: "",
                pgUniversity: "",
                pgYearofPassing: "",
                pgPercentage: "",
                hasExperience: false,
                experiences: [
                    {
                        company: "",
                        title: "",
                        startDate: "",
                        endDate: "",
                        description: "",
                        skills: "",
                    },
                ],
                bankName: "",
                accountNumber: "",
                ifscCode: "",
                branch: ""
            };


        const [sameAddress, setSameAddress] = useState(false)
        const navigate = useNavigate()
        const [errors, setErrors] = useState({})
    const handleCheckBox = (e) => {
        const checked = e.target.checked
        setSameAddress(checked)

        if(checked){
            setFormData((prev) => ({
                ...prev,
                communicationAddress: prev.permanentAddress
            }))
        }
    }

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleExperienceChange = (index, field, value) => {
        const updated = [...formData.experiences]
        updated[index][field] = value
        setFormData({...formData, experiences: updated})
    }

    const handleNext = () => {
        if(validate()) setActiveStep((prev) => prev + 1)
    }

    const handleBack = () => {
        setActiveStep((prev) => prev - 1)
    }

    const handleSubmit = async () => {
        if(!validate()) return
        try{
            const dataSend = {
                ...formData,
                empId : user?.empid,
                email : user?.email
            }
            const response = await API.post("/api/employees", dataSend)
            console.log(response.data)

            setFormData(initialFormData)
            setActiveStep(0)
            setOpen(false)
            navigate("/employee-details")
        } catch(error) {
            console.log(error.response?.data)
        }
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
                                value={user?.empid}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="name"
                                value={formData.name || ""}
                                onChange={handleChange}
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                value={user?.email}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Contact Number"
                                name="contact"
                                value={formData.contact || ""}
                                onChange={handleChange}
                                error={!!errors.contact} 
                                helperText={errors.contact}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Father Name"
                                name="fatherName"
                                value={formData.fatherName || ""}
                                onChange={handleChange}
                                error={!!errors.fatherName} 
                                helperText={errors.fatherName}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Mother Name"
                                name="motherName"
                                value={formData.motherName || ""}
                                onChange={handleChange}
                                error={!!errors.motherName} 
                                helperText={errors.motherName}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Occupation"
                                name="occupation"
                                value={formData.occupation || ""}
                                onChange={handleChange}
                                error={!!errors.occupation}
                                helperText={errors.occupation}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Father/Mother Number"
                                name="faormoNumber"
                                value={formData.faormoNumber || ""}
                                onChange={handleChange}
                                error={!!errors.faormoNumber}
                                helperText={errors.faormoNumber}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Permanent Address"
                                name="permanentAddress"
                                value={formData.permanentAddress || ""}
                                onChange={handleChange}
                                error={!!errors.permanentAddress} 
                                helperText={errors.permanentAddress}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={sameAddress}
                                        onChange={handleCheckBox} 
                                    />
                                }
                                label="Same as Permanent Address"
                            />

                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Communication Address"
                                name="communicationAddress"
                                value={formData.communicationAddress || ""}
                                onChange={handleChange}
                                disabled={sameAddress}
                                error={!!errors.communicationAddress} 
                                helperText={errors.communicationAddress}
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
                                error={!!errors.gender}
                                helperText={errors.gender}
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
                                error={!!errors.dob}
                                helperText={errors.dob}
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
                                error={!!errors.bloodGroup}
                                helperText={errors.bloodGroup}
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
                                error={!!errors.maritalStatus}
                                helperText={errors.maritalStatus}
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
                            error={!!errors.aadhaar}
                            helperText={errors.aadhaar}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                            fullWidth
                            label="PAN Number"
                            name="pan"
                            value={formData.pan || ""}
                            onChange={handleChange}
                            error={!!errors.pan}
                            helperText={errors.pan}
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
                                onChange={handleChange}
                                error={!!errors.tenthBoard}
                                helperText={errors.tenthBoard}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography>Year Of Passing</Typography>
                                <TextField 
                                fullWidth 
                                name="tenthYearofPassing" 
                                value={formData.tenthYearofPassing} 
                                onChange={handleChange}
                                error={!!errors.tenthYearofPassing}
                                helperText={errors.tenthYearofPassing} 
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography>Percentage / CGPA</Typography>
                                <TextField 
                                fullWidth 
                                name="tenthPercentage" 
                                value={formData.tenthPercentage} 
                                onChange={handleChange}
                                error={!!errors.tenthPercentage}
                                helperText={errors.tenthPercentage} 
                                />
                            </Grid>

                            <Grid item xs={12} >
                                <Typography>12th</Typography>
                                <TextField 
                                fullWidth label="Board / University" 
                                name="twelveBoard" 
                                value={formData.twelveBoard} 
                                onChange={handleChange}
                                error={!!errors.twelveBoard}
                                helperText={errors.twelveBoard} 
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography>Year Of Passing</Typography>
                                <TextField 
                                fullWidth 
                                name="twelveYearofPassing" 
                                value={formData.twelveYearofPassing} 
                                onChange={handleChange}
                                error={!!errors.twelveYearofPassing}
                                helperText={errors.twelveYearofPassing} 
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography>Percentage / CGPA</Typography>
                                <TextField 
                                fullWidth name="twelvePercentage" 
                                value={formData.twelvePercentage} 
                                onChange={handleChange}
                                error={!!errors.twelvePercentage}
                                helperText={errors.twelvePercentage} 
                                />
                            </Grid>

                            <Grid item xs={12} >
                                <Typography>UG</Typography>
                                <TextField 
                                fullWidth label="Board / University" 
                                name="ugUniversity" 
                                value={formData.ugUniversity} 
                                onChange={handleChange}
                                error={!!errors.ugUniversity}
                                helperText={errors.ugUniversity}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography>Year Of Passing</Typography>
                                <TextField 
                                fullWidth 
                                name="ugYearofPassing" 
                                value={formData.ugYearofPassing} 
                                onChange={handleChange}
                                error={!!errors.ugYearofPassing}
                                helperText={errors.ugYearofPassing} 
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography>Percentage / CGPA</Typography>
                                <TextField 
                                fullWidth 
                                name="ugPercentage" 
                                value={formData.ugPercentage} 
                                onChange={handleChange}
                                error={!!errors.ugPercentage}
                                helperText={errors.ugPercentage} 
                                />
                            </Grid>

                            <Grid item xs={12} >
                                <Typography>PG</Typography>
                                <TextField 
                                fullWidth label="Board / University" 
                                name="pgUniversity" 
                                value={formData.pgUniversity} 
                                onChange={handleChange}
                                error={!!errors.pgUniversity}
                                helperText={errors.pgUniversity} 
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography>Year Of Passing</Typography>
                                <TextField 
                                fullWidth 
                                name="pgYearofPassing" 
                                value={formData.pgYearofPassing} 
                                onChange={handleChange}
                                error={!!errors.pgYearofPassing}
                                helperText={errors.pgYearofPassing} 
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography>Percentage / CGPA</Typography>
                                <TextField 
                                fullWidth 
                                name="pgPercentage" 
                                value={formData.pgPercentage} 
                                onChange={handleChange}
                                error={!!errors.pgPercentage}
                                helperText={errors.pgPercentage} 
                                />
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
                                            error={!!errors[`experiences.${index}.company`]}
                                            helperText={errors[`experiences.${index}.company`]}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                            fullWidth
                                            label='Job Title'
                                            value={exp.title}
                                            onChange={(e) => 
                                                handleExperienceChange(index, "title", e.target.value)}
                                            error={!!errors[`experiences.${index}.title`]}
                                            helperText={errors[`experiences.${index}.title`]}
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
                                            error={!!errors[`experiences.${index}.startDate`]}
                                            helperText={errors[`experiences.${index}.startDate`]}
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
                                            error={!!errors[`experiences.${index}.endDate`]}
                                            helperText={errors[`experiences.${index}.endDate`]}
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
                                            error={!!errors[`experiences.${index}.description`]}
                                            helperText={errors[`experiences.${index}.description`]}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                            fullWidth
                                            label='Skills'
                                            value={exp.skills}
                                            onChange={(e) => 
                                                handleExperienceChange(index, "skills", e.target.value)}
                                            error={!!errors[`experiences.${index}.skills`]}
                                            helperText={errors[`experiences.${index}.skills`]}
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
                                error={!!errors.bankName}
                                helperText={errors.bankName}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                fullWidth
                                label="Account Number"
                                name='accountNumber'
                                value={formData.accountNumber}
                                onChange={handleChange}
                                error={!!errors.accountNumber}
                                helperText={errors.accountNumber}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                fullWidth
                                label="IFSC Code"
                                name='ifscCode'
                                value={formData.ifscCode}
                                onChange={handleChange}
                                error={!!errors.ifscCode}
                                helperText={errors.ifscCode}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                fullWidth
                                label="Branch"
                                name='branch'
                                value={formData.branch}
                                onChange={handleChange}
                                error={!!errors.branch}
                                helperText={errors.branch}
                                />
                            </Grid>
                        </Grid>
                    )
                
                case 4:
                    return (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Card variant='outlined' sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}>
                                    <Typography variant='h6'>
                                        Personal Details
                                    </Typography>
                                    <Divider sx={{ mb: 2 }}/>
                                    {[
                                        ["Employee ID", user?.empid],
                                        ["Full Name", formData.name],
                                        ["Email", user?.email],
                                        ["Contact Number", formData.contact],
                                        ["Father Name", formData.fatherName],
                                        ["Mother Name", formData.motherName],
                                        ["Occupation", formData.occupation],
                                        ["Parent Contact", formData.faormoNumber],
                                        ["Permanent Address", formData.permanentAddress],
                                        ["Communication Address", formData.communicationAddress],
                                        ["Gender", formData.gender],
                                        ["Date of Birth", formData.dob],
                                        ["Blood Group", formData.bloodGroup],
                                        ["Marital Status", formData.maritalStatus],
                                        ...formData.maritalStatus === "Married" ? [["Spouse Name", formData.spouseName],["Spouse Number", formData.spouseContact]] : [],
                                        ["Aadhaar", formData.aadhaar],
                                        ["PAN", formData.pan],
                                    ].map(([label, value], i) => (
                                        <Grid container key={i} sx={{ mb: 1}}>
                                            <Grid item xs={5}>
                                                <Typography color='textSecondary'>{label}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography>{value || "-"}</Typography>
                                            </Grid>
                                        </Grid>
                                    ))}
                                </Card>
                            </Grid>

                            <Grid item xs={12}>
                                <Card variant='outlined' sx={{ p:3, borderRadius: 2, boxShadow: 1 }}>
                                    <Typography variant='h6'>Educational Details</Typography>
                                    <Divider sx={{mb: 2}}/>
                                    {[
                                        ["10th", `${formData.tenthBoard} | Year : ${formData.tenthYearofPassing} | Per/CGPA : ${formData.tenthPercentage}`],
                                        ["12th", `${formData.twelveBoard} | Year : ${formData.twelveYearofPassing} | Per/CGPA : ${formData.twelvePercentage}`],
                                        ["UG", `${formData.ugUniversity} | Year : ${formData.ugYearofPassing} | Per/CGPA : ${formData.ugPercentage}`],
                                        ["PG", `${formData.pgUniversity} | Year : ${formData.pgYearofPassing} | Per/CGPA : ${formData.pgPercentage}`],
                                    ].map(([label, value], i) => (
                                        <Grid container key={i} sx={{ mb: 1 }}>
                                            <Grid item xs={4}>
                                                <Typography color='textSecondary'>{label}</Typography>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Typography>{value || "-"}</Typography>
                                            </Grid>
                                        </Grid>
                                    ))}
                                </Card>
                            </Grid>

                            <Grid item xs={12}>
                                <Card variant='outlined' sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}>
                                    <Typography variant='h6'>Work Experience</Typography>
                                <Divider sx={{ mb: 2 }}/>
                                {formData.hasExperience ?  (
                                    formData.experiences.map((exp, idx) => (
                                        <Card key={idx} sx={{ p: 3, borderRadius: 2, mb: 2}}>
                                            {[
                                                ["Company", exp.company],
                                                ["Title", exp.title],
                                                ["Start Date", exp.startDate],
                                                ["End Date", exp.endDate],
                                                ["Description", exp.description],
                                                ["Skills", exp.skills],
                                                ].map(([label, value], i) => (
                                                <Grid container key={i} sx={{ mb: 1 }}>
                                                    <Grid item xs={4}>
                                                    <Typography color="textSecondary">{label}</Typography>
                                                    </Grid>
                                                    <Grid item xs={8}>
                                                    <Typography>{value || "-"}</Typography>
                                                    </Grid>
                                                </Grid>
                                                ))}
                                        </Card>
                                    ))
                                ) : (
                                    <Typography>No Work Experience</Typography>
                                )}
                                </Card>
                            </Grid>

                            <Grid item xs={12}>
                                <Card variant='outlined' sx={{ p:3, borderRadius: 2, boxShadow: 1 }}>
                                    <Typography variant='h6'>Bank Details</Typography>
                                    <Divider sx={{ mb: 2 }}/>
                                    {[
                                        ["Bank Name", formData.bankName],
                                        ["Account Number", formData.accountNumber],
                                        ["IFSC Code", formData.ifscCode],
                                        ["Branch", formData.branch],
                                    ].map(([label, value], i) => (
                                        <Grid container key={i} sx={{ mb: 1 }}>
                                            <Grid item xs={5}>
                                                <Typography color='textSecondary'>{label}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography>{value || "-"}</Typography>
                                            </Grid>
                                        </Grid>
                                    ))
                                    }
                                </Card>
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
                    <Button variant='contained' onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}>
                        {activeStep === steps.length -1 ? "Submit" : "Next"}
                    </Button>
                </Box>
            </Box>
        )
        }

export default EmployeeForm
