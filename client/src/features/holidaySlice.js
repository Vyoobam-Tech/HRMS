import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axiosInstance";

export const addHoliday = createAsyncThunk(
    "holiday/add",
    async (payload, { rejectWithValue }) => {
        try {
        const res = await API.post("/api/holiday", payload);
        return res.data.data;
        } catch (err) {
        return rejectWithValue(err.response?.data);
        }
    }
)

export const fetchHoliday = createAsyncThunk(
    "holiday/fetch",
    async (_, {rejectWithValue}) => {
        try{
            const res = await API.get("/api/holiday/all")
            return res.data.data
        }catch(err){
            return rejectWithValue(err.response?.data)
        }
    }
)


export const deleteHoliday = createAsyncThunk(
    "holiday/delete",
    async (id, { rejectWithValue }) => {
        try {
        await API.delete(`/api/holiday/${id}`);
        return id
        } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
        }
    }
)

export const fetchTodayHoliday = createAsyncThunk(
    "holiday/fetchToday",
    async () => {
        const res = await API.get("/api/holiday/all");
        const today = new Date().toISOString().split("T")[0];

        return res.data.data.some(
        (h) => new Date(h.date).toISOString().split("T")[0] === today
        );
    }
);


const holidaySlice = createSlice({
    name: "holiday",
    initialState: {
        holidays: [],
        todayHoliday: false,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(addHoliday.fulfilled, (state, action) => {
            state.holidays.push(action.payload)
        })

        .addCase(fetchHoliday.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchHoliday.fulfilled, (state, action) => {
            state.loading = false;
            state.holidays = action.payload;
        })
        .addCase(fetchHoliday.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        .addCase(deleteHoliday.fulfilled, (state, action) => {
            state.loading = false;
            state.holidays = state.holidays.filter(
            (holiday) => holiday.id !== action.payload)
        })

        .addCase(fetchTodayHoliday.fulfilled, (state, action) => {
            state.todayHoliday = action.payload;
        });
    }
})

export default holidaySlice.reducer;
