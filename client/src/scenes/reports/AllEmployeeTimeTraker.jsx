import { AgGridReact } from 'ag-grid-react'
import axios from 'axios'
import React, { useEffect, useMemo, useState } from 'react'
import Header from '../../components/Header'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material'
import EditIcon from "@mui/icons-material/Edit";

const AllEmployeeTimeTraker = () => {

    const [gridKey, setGridKey] = useState(0)
    const [rowData, setRowData] = useState([])
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedRow, setSelectedRow] = useState(null)

    useEffect(() => {
        const fetchEmployeeAttendance = async () => {
            try{
                const response = await axios.get("http://localhost:3000/api/attendance/all")
                setRowData(response.data.data)
            } catch (err) {
                console.log(err)
            }
        }

        fetchEmployeeAttendance()
    }, [])

    const handleEdit = (row) => {
        setSelectedRow(row)
        setShowEditModal(true)
    }

    const handleSave = async () => {
            try{
                const response = await axios.put(`http://localhost:3000/api/attendance/${selectedRow.id}`,
                    {
                        login: selectedRow.login,
                        breakminutes: selectedRow.breakminutes,
                        lunchminutes: selectedRow.lunchminutes,
                        logout: selectedRow.logout,
                        totalhours: selectedRow.totalhours
                    }
                )

                if(response.data.success){
                    setShowEditModal(false)
                    setGridKey(prev =>prev+1)
                }
            } catch(err) {
                console.log(err)
            }
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
        {headerName: "Status", field: "status", maxWidth: 130},
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

        setSelectedRow(prev => ({...prev, totalhours: totalHours}))

    }, [selectedRow?.login, selectedRow?.breakminutes, selectedRow?.lunchminutes, selectedRow?.logout])

    return (
        <div
            style={{
            height: 450,
            marginRight: "60px",
            paddingBottom: "35px",
            paddingTop: "140px",
            marginLeft: "30px",
            }}
        >
            <Header title="Attendance Tracker"/>
            <AgGridReact
                key={gridKey}
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