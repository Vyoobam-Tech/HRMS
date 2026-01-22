import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../api/axiosInstance";


export const raiseTicket = createAsyncThunk(
    "ticket/raiseTicket",
    async (ticketData, { rejectWithValue }) => {
        try {
        const res = await API.post("/api/ticket", ticketData);
        return res.data;
        } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
        }
    }
)

export const fetchTicketByEmpId = createAsyncThunk(
    "ticket/fetchTicketByEmpId",
    async (empid, { rejectWithValue}) => {
        try{
            const res = await API.get(`/api/ticket/${empid}`)
            return res.data
        }catch(err){
            return rejectWithValue("Unable to fetch ticket")
        }
    }
)

export const fetchAllTicket = createAsyncThunk(
    "ticket/fetchAllTicket",
    async (_, { rejectWithValue}) => {
        try{
            const res = await API.get("/api/ticket")
            return res.data
        }catch(err){
            return rejectWithValue("Unable to fetch ticket")
        }
    }
)

export const updateTicketStatus = createAsyncThunk(
    "ticket/updateStatus",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const res = await API.patch(`/api/ticket/${id}/status`, { status });
            return res.data
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update status");
        }
    }
);

export const deleteTicket = createAsyncThunk(
    "ticket/deleteTicket",
    async (id, { rejectWithValue }) => {
        try {
            await API.delete(`/api/ticket/${id}`);
            return id
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to delete ticket");
        }
    }
);

const ticketSlice = createSlice({
    name: "ticket",
    initialState: {
        list: [],
        all: [],
        loading: false,
        error: null,
        success: false
    },
    reducers: {
    resetTicketState: (state) => {
        state.list = []
        state.all = []
        state.loading = false;
        state.error = null;
        state.success = false;
    },
  },
    extraReducers: (builder) => {
        builder
        .addCase(raiseTicket.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(raiseTicket.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
        })
        .addCase(raiseTicket.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        .addCase(fetchTicketByEmpId.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchTicketByEmpId.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        })
        .addCase(fetchTicketByEmpId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        })

        .addCase(fetchAllTicket.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchAllTicket.fulfilled, (state, action) => {
            state.loading = false;
            state.all = action.payload;
        })
        .addCase(fetchAllTicket.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        .addCase(updateTicketStatus.fulfilled, (state, action) => {
            state.loading = false;
            const updated = action.payload;
            state.list = state.list.map((t) => (t.ticketId === updated.ticketId ? updated : t));
            state.all = state.all.map((t) => (t.ticketId === updated.ticketId ? updated : t));
        })


        .addCase(deleteTicket.fulfilled, (state, action) => {
            const id = action.payload; // id of deleted ticket
            state.list = state.list.filter((t) => t.ticketId !== id);
            state.all = state.all.filter((t) => t.ticketId !== id);
        })

    }
})

export const { resetTicketState } = ticketSlice.actions
export default ticketSlice.reducer