import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axiosInstance";

export const fetchEmployeeLeave = createAsyncThunk(
    "leave/fetchEmployee",
    async (empid, { rejectWithValue }) => {
        try {
        const res = await API.get(`/api/leave/${empid}`);
        return res.data;
        } catch {
        return rejectWithValue("Failed to fetch leave balance");
        }
    }
);

export const fetchAllLeaves = createAsyncThunk(
    "leave/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
        const res = await API.get("/api/leave/all");
        return res.data;
        } catch {
        return rejectWithValue("Failed to fetch leave requests");
        }
    }
);

export const actionLeave = createAsyncThunk(
    "leave/action",
    async ({ id, status }, { rejectWithValue }) => {
        try {
        await API.put(`/api/leave/${id}/action`, { status });
        return { id, status };
        } catch {
        return rejectWithValue("Action failed");
        }
    }
);

export const fetchLeaveToday = createAsyncThunk(
    "leave/fetchToday",
    async (empid) => {
        const res = await API.get(`/api/leave/today/${empid}`);
        return res.data.hasLeave;
    }
);

const leaveSlice = createSlice({
    name: "leave",
    initialState: {
        data: null,
        hasLeaveToday: false,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchEmployeeLeave.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchEmployeeLeave.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(fetchAllLeaves.fulfilled, (state, action) => {
            state.loading = false;
            state.data = { LeaveRequests: action.payload };
        })
        .addCase(actionLeave.fulfilled, (state, action) => {
            const list = state.data?.LeaveRequests;
            const index = list?.findIndex(l => l.id === action.payload.id);
            if (index !== -1) {
            list[index].status = action.payload.status;
            }
        })

        .addCase(fetchLeaveToday.fulfilled, (state, action) => {
            state.hasLeaveToday = action.payload;
        });
    },
});

export default leaveSlice.reducer;
