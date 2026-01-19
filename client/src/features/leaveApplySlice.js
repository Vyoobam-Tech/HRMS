import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axiosInstance";

export const applyLeave = createAsyncThunk(
    "leave/apply",
    async ({ empid, form }, { rejectWithValue }) => {
        try {
        const res = await API.post("/api/leave/apply", {
            empid,
            ...form,
        });
        return res.data;
        } catch (err) {
        return rejectWithValue(
            err.response?.data?.message || "Failed to apply leave"
        );
        }
    }
);

export const deleteLeave = createAsyncThunk(
    "leave/delete",
    async (id, { rejectWithValue }) => {
        try {
        await API.delete(`/api/leave/${id}`);
        return id;
        } catch (err) {
        return rejectWithValue(err.response?.data?.message);
        }
    }
);

const leaveApplySlice = createSlice({
    name: "leaveApply",
    initialState: {
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetLeaveApply(state) {
        state.loading = false;
        state.error = null;
        state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(applyLeave.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        })
        .addCase(applyLeave.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
        })
        .addCase(applyLeave.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        .addCase(deleteLeave.fulfilled, (state, action) => {
            if (state.data?.LeaveRequests) {
                state.data.LeaveRequests = state.data.LeaveRequests.filter(
                (lr) => lr.id !== action.payload
                )
            }
        })
    },
});

export const { resetLeaveApply } = leaveApplySlice.actions;
export default leaveApplySlice.reducer;
