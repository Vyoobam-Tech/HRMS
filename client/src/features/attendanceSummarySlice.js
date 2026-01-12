import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axiosInstance";

export const fetchAttendanceSummary = createAsyncThunk(
    "attendanceSummary/fetch",
    async ({ empid, type, month, year }, { rejectWithValue }) => {
        try {
        const params = new URLSearchParams({
            empid,
            type,
            ...(type === "Monthly" && { month }),
            year,
        }).toString();

        const res = await API.get(`/api/attendance/summary?${params}`);
        return res.data;
        } catch (err) {
        return rejectWithValue(
            err.response?.data?.message || "Failed to fetch summary"
        );
        }
    }
);

const attendanceSummarySlice = createSlice({
    name: "attendanceSummary",
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearSummary(state) {
        state.data = null;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchAttendanceSummary.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAttendanceSummary.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(fetchAttendanceSummary.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export const { clearSummary } = attendanceSummarySlice.actions;
export default attendanceSummarySlice.reducer;
