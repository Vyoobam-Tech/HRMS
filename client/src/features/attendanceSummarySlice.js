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

export const fetchOTSummary = createAsyncThunk(
  "otSummary/fetch",
  async (payload, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(payload).toString();
      const res = await API.get(`/api/attendance/ot-summary?${params}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch OT"
      );
    }
  }
);

const attendanceSummarySlice = createSlice({
    name: "attendanceSummary",
    initialState: {
        data: null,
        ot: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearSummary(state) {
          state.data = null;
        },
        clearOT(state) {
          state.ot = null;
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
        })

        .addCase(fetchOTSummary.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchOTSummary.fulfilled, (state, action) => {
          state.loading = false;
          state.ot = action.payload;
        })
        .addCase(fetchOTSummary.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
});

export const { clearSummary, clearOT } = attendanceSummarySlice.actions;
export default attendanceSummarySlice.reducer;
