import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axiosInstance";

export const fetchAttendanceByUser = createAsyncThunk(
    "attendance/fetchByUser",
    async (empid, { rejectWithValue }) => {
        try {
        const res = await API.get(`/api/attendance/by-user/${empid}`);
        return res.data.data;
        } catch (err) {
        return rejectWithValue(
            err.response?.data?.message || "Failed to fetch attendance"
        );
        }
    }
);

export const fetchAllAttendance = createAsyncThunk(
    "attendance/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
        const res = await API.get("/api/attendance/all");
        return res.data.data;
        } catch (err) {
        return rejectWithValue(
            err.response?.data?.message || "Failed to fetch attendance"
        );
        }
    }
);

export const updateAttendance = createAsyncThunk(
    "attendance/update",
    async ({ id, payload }, { rejectWithValue }) => {
        try {
        const res = await API.put(`/api/attendance/${id}`, payload);
        return { id, data: res.data.data };
        } catch (err) {
        return rejectWithValue("Update failed");
        }
    }
);

export const deleteAttendance = createAsyncThunk(
    "attendance/delete",
    async (id, { rejectWithValue }) => {
        try {
        await API.delete(`/api/attendance/${id}`);
        return id
        } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
)

export const submitAttendance = createAsyncThunk(
    "attendance/submit",
    async (payload, { rejectWithValue }) => {
        try {
        const res = await API.post("/api/attendance", payload);
        return res.data.data;
        } catch {
        return rejectWithValue("Attendance submit failed");
        }
    }
);

const attendanceSlice = createSlice({
    name: "attendance",
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {
        addPermissionRow(state, action) {
        state.list.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchAttendanceByUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAttendanceByUser.fulfilled, (state, action) => {
            state.loading = false;
            state.list = action.payload;
        })
        .addCase(fetchAttendanceByUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        .addCase(fetchAllAttendance.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchAllAttendance.fulfilled, (state, action) => {
            state.loading = false;
            state.list = action.payload;
        })
        .addCase(fetchAllAttendance.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        .addCase(updateAttendance.fulfilled, (state, action) => {
            const index = state.list.findIndex(
            (item) => item.id === action.payload.id
            );
            if (index !== -1) {
            state.list[index] = {
                ...state.list[index],
                ...action.payload.data,
            };
            }
        })

        .addCase(deleteAttendance.fulfilled, (state, action) => {
            state.list = state.list.filter(item => item.id !== action.payload)
        })
        .addCase(deleteAttendance.rejected, (state, action) => {
            state.error = action.payload
        })

        .addCase(submitAttendance.pending, (state) => {
            state.loading = true;
        })
        .addCase(submitAttendance.fulfilled, (state, action) => {
            state.loading = false;
            state.list.unshift(action.payload);
        })
        .addCase(submitAttendance.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export const { addPermissionRow } = attendanceSlice.actions;
export default attendanceSlice.reducer;