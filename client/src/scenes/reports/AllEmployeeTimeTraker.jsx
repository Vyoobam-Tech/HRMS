import { AgGridReact } from 'ag-grid-react'
import React, { useEffect, useMemo, useState } from 'react'
import Header from '../../Components/Header'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material'
import EditIcon from "@mui/icons-material/Edit";
import API from '../../api/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../../features/auth/authSlice';
import { fetchAllAttendance, updateAttendance } from '../../features/attendanceSlice';

const AllEmployeeTimeTraker = () => {

    const [gridKey, setGridKey] = useState(0)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedRow, setSelectedRow] = useState(null)

    const dispatch = useDispatch()

    const { user, loading: authLoading, error: authError } = useSelector(
        (state) => state.auth
    )

    const { list: rowData, loading } = useSelector(
    (state) => state.attendance
    );

    useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch])


    useEffect(() => {
        dispatch(fetchAllAttendance())
    }, [dispatch])

    const handleEdit = (row) => {
        setSelectedRow(row)
        setShowEditModal(true)
    }

    const handleSave = async () => {
            dispatch(
                updateAttendance({
                id: selectedRow.id,
                payload: {
                    login: selectedRow.login,
                    breakminutes: selectedRow.breakminutes,
                    lunchminutes: selectedRow.lunchminutes,
                    logout: selectedRow.logout,
                    totalminutes: selectedRow.totalminutes,
                    totalhours: selectedRow.totalhours,
                    status: selectedRow.status,
                },
                })
            );

            setShowEditModal(false)
        }


    const [columnDefs] = useState([
        {headerName: "Emp ID", field: "empid"},
        {headerName: "Name", field: "name"},
        {headerName: "Date", field: "attendancedate"},
        {headerName: "Login", field: "login"},
        {headerName: "Break", field: "breakminutes"},
        {headerName: "Lunch", field: "lunchminutes"},
        {headerName: "Logout", field: "logout"},
        {headerName: "Total Hours", field: "totalhours"},
        {headerName: "Status", field: "status", maxWidth: 150, 
            cellStyle: (params) => {
                if(params.value === "Present"){
                    return { color: "#4caf50", fontWeight: "bold"}
                }
                if(params.value === "Half-day"){
                    return { color: "#ff9800", fontWeight: "bold"}
                }
                if(params.value === "Absent"){
                    return { color: "#f44336", fontWeight: "bold"}
                }
            }
        },
        {headerName: "Actions", field: "actions",
            cellRenderer: (params) => (
                <div
                    style={{ display: "flex", gap: 8 }}
                >
                    <IconButton
                        onClick={() => handleEdit(params.data)}
                        color='primary'
                        size='small'
                    >
                        <EditIcon />
                    </IconButton>
                </div>
            )
        }
    ])

    const defaultColDef = useMemo(() => (
        {
        filter: "agTextColumnFilter",
        floatingFilter: true
    }), [])

    useEffect(() => {
        if (!selectedRow) return

        const {login, breakminutes, lunchminutes, logout } = selectedRow

        if(!login || !logout) return

        const loginTime = new Date(`${selectedRow.attendancedate}T${login}`)
        const logoutTime = new Date(`${selectedRow.attendancedate}T${logout}`)

        const workedMinutes = Math.floor((logoutTime - loginTime) / 60000)

        const breakMins = parseInt(breakminutes) || 0
        const lunchMins = parseInt(lunchminutes) || 0

        const totalWorkedMins = Math.max(0, workedMinutes - (breakMins+lunchMins))

        const hours = Math.floor(totalWorkedMins / 60)
        const minutes = totalWorkedMins % 60
        const totalHours = `${hours}h ${minutes}m`

        let status = ""
        if (hours >= 8) status = "Present"
        else if (hours >= 6 && hours < 8) status = "Half-day"
        else if (hours >= 4 && hours < 6) status = "Half-day"
        else status = "Absent"


        setSelectedRow(prev => ({...prev, totalminutes: totalWorkedMins, totalhours: totalHours, status}))

    }, [selectedRow?.login, selectedRow?.breakminutes, selectedRow?.lunchminutes, selectedRow?.logout])

    return (
        <div
            style={{
                minHeight: "100vh",
                width: "100%",
                padding: "120px 40px 20px 40px",
                boxSizing: "border-box",
            }}
        >
            <Header title="ATTENDANCE TRACKER"/>
            <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                domLayout='autoHeight'
                pagination={true}
                paginationPageSize={10}
                paginationPageSizeSelector={[10,25,50]}
                onGridReady={(params) => {
                    params.api.sizeColumnsToFit()
                }}
            />

            <Dialog
                open={showEditModal}
                onClose={() => setShowEditModal(false)}
                fullWidth
                maxWidth="sm"
            >
                <div
                    style={{
                        background: "#1976D2",
                        color: "white"
                    }}
                >
                    <DialogTitle>Edit Attendance</DialogTitle>
                </div>
                <DialogContent>
                    {selectedRow && (
                        <>
                            <TextField
                                label="Login Time"
                                fullWidth
                                margin='dense'
                                value={selectedRow.login || ""}
                                onChange={(e) => setSelectedRow({...selectedRow, login: e.target.value})}
                            />
                            <TextField
                                label="Break Time"
                                fullWidth
                                margin='dense'
                                value={selectedRow.breakminutes || ""}
                                onChange={(e) => setSelectedRow({...selectedRow, breakminutes: e.target.value})}
                            />
                            <TextField
                                label="Lunch Time"
                                fullWidth
                                margin='dense'
                                value={selectedRow.lunchminutes}
                                onChange={(e) => setSelectedRow({...selectedRow, lunchminutes: e.target.value})}
                            />
                            <TextField
                                label="Logout"
                                fullWidth
                                margin='dense'
                                value={selectedRow.logout}
                                onChange={(e) => setSelectedRow({...selectedRow, logout: e.target.value})}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowEditModal(false) } variant='contained' color='error'>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} variant='contained' color='primary'>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default AllEmployeeTimeTraker