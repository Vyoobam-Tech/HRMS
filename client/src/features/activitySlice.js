import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axiosInstance";


export const fetchMyActivities = createAsyncThunk(
    "activity/fetchMy",
    async (empid, { rejectWithValue }) => {
        try {
        const res = await API.get(`/api/activities/by-user/${empid}`);
        return res.data.data;
        } catch (err) {
        return rejectWithValue(err.response?.data);
        }
    }
);

export const fetchAllActivities = createAsyncThunk(
    "activity/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
        const res = await API.get('/api/activities/all');
        return res.data.data;
        } catch (err) {
        return rejectWithValue(err.response?.data);
        }
    }
);

export const addActivity = createAsyncThunk(
    "activity/add",
    async (payload, { rejectWithValue }) => {
        try {
        const res = await API.post("/api/activities", payload);
        return res.data.data;
        } catch (err) {
        return rejectWithValue(err.response?.data);
        }
    }
);

export const updateActivity = createAsyncThunk(
    "activity/update",
    async ({ actid, data }, { rejectWithValue }) => {
        try {
        const res = await API.put(`/api/activities/update/${actid}`, data);
        return res.data.data;
        } catch (err) {
        return rejectWithValue(err.response?.data);
        }
    }
);

export const deleteActivity = createAsyncThunk(
    "activity/delete",
    async (actid, { rejectWithValue }) => {
        try {
        await API.delete(`/api/activities/${actid}`);
        return actid;
        } catch (err) {
        return rejectWithValue(err.response?.data);
        }
    }
);

const activitySlice = createSlice({
    name: "activity",
    initialState: {
        myActivities: [],
        allActivities: [],
        loading: false,
        error: null
    },
    reducers: {
        clearActivities: (state) => {
        state.myActivities = [];
        state.allActivities = [];
    },
    },
    extraReducers: (builder) => {
        builder

        .addCase(fetchMyActivities.pending, (state) => {
        state.loading = true;
        })
        .addCase(fetchMyActivities.fulfilled, (state, action) => {
            state.loading = false;
            state.myActivities = action.payload;
        })
        .addCase(fetchMyActivities.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        /* ================= FETCH ALL ================= */
        .addCase(fetchAllActivities.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchAllActivities.fulfilled, (state, action) => {
            state.loading = false;
            state.allActivities = action.payload;
        })
        .addCase(fetchAllActivities.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        /* ================= ADD ================= */
        .addCase(addActivity.fulfilled, (state, action) => {
            state.myActivities.unshift(action.payload);
        })

        /* ================= UPDATE ================= */
        // .addCase(updateActivity.fulfilled, (state, action) => {
        //     const index = state.myActivities.findIndex(
        //     (a) => a.actid === action.payload.actid
        //     );
        //     if (index !== -1) {
        //     state.myActivities[index] = action.payload;
        //     }
        // })

        /* ================= DELETE ================= */
        // .addCase(deleteActivity.fulfilled, (state, action) => {
        //     state.myActivities = state.myActivities.filter(
        //     (a) => a.actid !== action.payload
        //     );
        // });
    },
})

export const { clearActivities } = activitySlice.actions;
export default activitySlice.reducer;

