import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axiosInstance";

export const fetchAllEmployees = createAsyncThunk(
    "employee/fetchEmployees",
    async (_, {rejectWithValue}) => {
        try{
            const res = await API.get("/api/employees/all")
            return res.data.data
        }catch(err){
            return rejectWithValue(err.response?.data)
        }
    }
)

export const fetchEmployeeByEmail = createAsyncThunk(
    'employee/fetchByEmail',
    async (email, {rejectWithValue}) => {
        try{
            const response = await API.get(`/api/employees/by-user/${email}`);
            return response.data.data;
        }catch(err){
            return rejectWithValue(err.response?.data)
        }
    }
)

export const addEmployeeDetails = createAsyncThunk(
    'employee/addEmployee',
    async(payload, {rejectWithValue}) => {
        try{
            const res = await API.post("/api/employees", payload)
            return res.data.data
        }catch(err){
            return rejectWithValue(err.response?.data)
        }
    }
)

export const deleteEmployee = createAsyncThunk(
    "employee/delete",
    async (empId, {rejectWithValue}) => {
        try{
            await API.delete(`/api/employees/delete/${empId}`)
            return empId
        }catch(err){
            return rejectWithValue(err.response?.data)
        }
    }
)

export const updateEmployee = createAsyncThunk(
    'employee/update',
    async ({ empId, data }, {rejectWithValue}) => {
        try{
            const response = await API.put(`/api/employees/update/${empId}`, data);
            return response.data.data
        }catch(err){
            return rejectWithValue(err.response?.data)
        }
    }
)

const employeeSlice = createSlice({
    name: "employee",
    initialState: {
        single: null,
        all: [],
        loading: false,
        error: null
    },
    reducers: {
        clearEmployee: (state) => {
            state.single = null
        }
    },
    extraReducers: (builder) => {
    // fetch all employees
    builder
        .addCase(fetchAllEmployees.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAllEmployees.fulfilled, (state, action) => {
            state.loading = false;
            state.all = action.payload;
        })
        .addCase(fetchAllEmployees.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to fetch employees";
        });

        builder
        .addCase(fetchEmployeeByEmail.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchEmployeeByEmail.fulfilled, (state, action) => {
            state.loading = false;
            state.single = action.payload;
        })
        .addCase(fetchEmployeeByEmail.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to fetch employee";
        });

        builder
        .addCase(updateEmployee.fulfilled, (state, action) => {
            state.loading = false;
            state.single = action.payload;
            // update in the all list if exists
            const index = state.all.findIndex(emp => emp.empId === action.payload.empId);
            if (index !== -1) state.all[index] = action.payload;
        })


        builder
        .addCase(deleteEmployee.fulfilled, (state, action) => {
            state.all = state.all.filter(emp => emp.empId !== action.payload)
        })

        builder
        .addCase(addEmployeeDetails.fulfilled, (state, action) => {
            state.loading = false
            state.all.push(action.payload)
        })
    }
})

export const {clearEmployee} = employeeSlice.actions
export default employeeSlice.reducer