import { Button, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useMemo, useState } from 'react'
import Header from '../../components/Header'
import PowerSettingsNewRoundedIcon from "@mui/icons-material/PowerSettingsNewRounded";
import { Box, Stack } from '@mui/system';
import { AgGridReact } from 'ag-grid-react';

const EachEmployeeTimeTracker = () => {

    const [gridKey, setGridKey] = useState(0)
    const [user, setUser] = useState(null)
    // const [employee, setEmployee] = useState(null)
    const [rowData, setRowData] = useState([])

    useEffect(() => {
        const fetchUser = async () => {
            try{
                const res = await axios.get("http://localhost:3000/auth/profile", { withCredentials: true})
                if(res.data.user){
                    setUser(res.data.user)
                }
            }catch(err){
                console.log(err)
            }
        }
        fetchUser()
    }, [])

    // useEffect(() => {
    //     if(!user?.email) return
    //     const fetchEmployee = async () => {
    //     try{
    //         const response = await axios.get(`http://localhost:3000/api/employees/by-user/${user.email}`, {withCredentials: true})
    //         if(response.data.status){
    //         setEmployee(response.data.data)
    //         }
    //     } catch(err){
    //         console.log(err)
    //     }
    //     }
    //     fetchEmployee()
    // }, [user])


    useEffect(() => {
        if(!user?.empid) return
        const fetchEmployeeAttendance = async () => {
            try{
                const response = await axios.get(`http://localhost:3000/api/attendance/by-user/${user.empid}`, {withCredentials: true})
                setRowData(response.data.data)
            } catch(err) {
                console.log(err)
            }
        }
        fetchEmployeeAttendance()
    }, [user])


    const [columDefs] = useState([
        {headerName: "Date", field: "attendancedate"},
        {headerName: "Login", field: "login"},
        {headerName: "Break", field: "breakminutes"},
        {headerName: "Lunch", field: "lunchminutes"},
        {headerName: "Logout", field: "logout"},
        {headerName: "Total Hours", field: "totalhours"},
    ])

    const defaultColDef = useMemo(() => ({
        filter: "agTextColumnFilter",
        floatingFilter: true
    }))


    return (
        <div
            style={{
                height: 450,
                width: "100%",
                marginRight: "60px",
                paddingTop: "120px",
            }}
        >
            <Header title="MY ATTENDANCE"/>

            <AgGridReact
                // key={gridKey}
                rowData={rowData}
                columnDefs={columDefs}
                defaultColDef={defaultColDef}
                domLayout="autoHeight"
                pagination={true}
                paginationPageSize={10}
                paginationPageSizeSelector={[10,25,50]}
                onGridReady={(params) => {
                    params.api.sizeColumnsToFit()
                }}
            />
        </div>
    )
}

export default EachEmployeeTimeTracker