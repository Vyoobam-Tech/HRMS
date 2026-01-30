import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axiosInstance";

export const fetchDashboardStats = createAsyncThunk(
    "dashboard/fetchStats",
    async (empid, { rejectWithValue }) => {
        try {
        const [dep, myact, allact, emp, pay] = await Promise.all([
            API.get("/api/departments/all"),
            API.get(`/api/activities/by-user/${empid}`),
            API.get("/api/activities/all"),
            API.get("/api/employees/all"),
            // API.get("/api/payroll/stats"), // New Payroll Stats
        ]);

        return {
            departments: dep.data.data.length,
            myactivity: myact.data.data.length,
            allactivitities: allact.data.data.length,
            employees: emp.data.data.length,
            // payroll: pay.data.data // { totalNetPay, totalEarnings, totalDeductions ... }
        };
        } catch (err) {
        return rejectWithValue(err.response?.data || "Failed to fetch stats");
        }
    }
);

export const fetchBirthdayEmployees = createAsyncThunk(
    "birthday/fetchBirthdayEmployees",
    async (_, { rejectWithValue }) => {
        try {
        const response = await API.get("/api/employees/all");
        if (!response.data.status) throw new Error("Failed to fetch employees");

        const allEmployee = response.data.data;
        const today = new Date();
        const todayStr = `${String(today.getDate()).padStart(2, "0")}-${String(
            today.getMonth() + 1
        ).padStart(2, "0")}-${today.getFullYear()}`;

        const todayBirthday = allEmployee.filter((emp) => {
            if (!emp.dob) return false;
            const dob = new Date(emp.dob);
            const dobStr = `${String(dob.getDate()).padStart(2, "0")}-${String(
            dob.getMonth() + 1
            ).padStart(2, "0")}-${dob.getFullYear()}`;
            return dobStr === todayStr;
        });

        return todayBirthday;
        } catch (err) {
        return rejectWithValue(err.message);
        }
    }
);


const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: {
        stats: null,
        status: "idle",            
        birthdays: [],         
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchDashboardStats.pending, (state) => {
            state.status = "loading";
            state.error = null;
        })
        .addCase(fetchDashboardStats.fulfilled, (state, action) => {
            state.status = "success";
            state.stats = action.payload;
        })
        .addCase(fetchDashboardStats.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload;
        })

        .addCase(fetchBirthdayEmployees.pending, (state) => {
            state.status = "loading";
            state.error = null;
        })
        .addCase(fetchBirthdayEmployees.fulfilled, (state, action) => {
            state.status = "success";
            state.birthdays = action.payload;
        })
        .addCase(fetchBirthdayEmployees.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload;
        });
    },
});


export default dashboardSlice.reducer;
