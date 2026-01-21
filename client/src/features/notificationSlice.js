import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../api/axiosInstance";


export const createNotification = createAsyncThunk(
    "notification/createNotification",
    async ({ title, message, empId = null }, { rejectWithValue }) => {
        try {
        const res = await API.post("/api/notifications", {
            title,
            message,
            empId,
        });
        return res.data;
        } catch (err) {
        return rejectWithValue(err.response?.data || "Something went wrong");
        }
    }
);

export const fetchNotifications = createAsyncThunk(
    "notification/fetchNotification",
    async (empId, { rejectWithValue }) => {
        try {
        const res = await API.get(`/api/notifications/${empId}`);
        return res.data
        } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
        }
    }
)

export const deleteNotification = createAsyncThunk(
    "notification/deleteNotification",
    async (id, { rejectWithValue }) => {
        try {
        await API.delete(`/api/notifications/${id}`)
        return id
        } catch (err) {
        return rejectWithValue(err.response?.data || err.message)
        }
    }
);

const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        list: [],
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        clearNotificationState: (state) => {
        state.loading = false;
        state.error = null;
        state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
        // CREATE
        .addCase(createNotification.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createNotification.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.list.unshift(action.payload);
        })
        .addCase(createNotification.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // FETCH
        .addCase(fetchNotifications.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchNotifications.fulfilled, (state, action) => {
            state.loading = false;
            state.list = action.payload;
        })
        .addCase(fetchNotifications.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        .addCase(deleteNotification.fulfilled, (state, action) => {
            state.loading = false;
            state.list = state.list.filter(
            (n) => n.notificationId !== action.payload
            )
        })
    },
});

export const { clearNotificationState } = notificationSlice.actions;
export default notificationSlice.reducer;