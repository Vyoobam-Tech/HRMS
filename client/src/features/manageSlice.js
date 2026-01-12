import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axiosInstance";


export const fetchNames = createAsyncThunk(
    "names/fetchNames",
    async (_, { rejectWithValue }) => {
        try {
        const res = await API.get("/api/names/all");
        return res.data.data;
        } catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

export const addName = createAsyncThunk(
    "names/addName",
    async ({ name, type }, { rejectWithValue }) => {
        try {
        const res = await API.post("/api/names", { name, type });
        return res.data.data;
        } catch (err) {
        return rejectWithValue(err.response?.data);
        }
    }
);

export const deleteName = createAsyncThunk(
    "names/deleteName",
    async ({ id, type }, { rejectWithValue }) => {
        try {
        await API.delete(`/api/names/${id}`);
        return { id, type };
        } catch (err) {
        return rejectWithValue(err.response?.data);
        }
    }
);

const namesSlice = createSlice({
    name: "names",
    initialState: {
        departmentNames: [],
        reportNames: [],
        loading: false,
        error: null,
    },
    reducers: {
        addDepartment(state, action) {
        state.departmentNames.push(action.payload);
        },
        addReport(state, action) {
        state.reportNames.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchNames.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchNames.fulfilled, (state, action) => {
            state.loading = false;

            state.departmentNames = action.payload.filter(
            (n) => n.type === "DEPARTMENT"
            );
            state.reportNames = action.payload.filter(
            (n) => n.type === "REPORT"
            );
        })
        .addCase(fetchNames.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        .addCase(addName.fulfilled, (state, action) => {
            if (action.payload.type === "DEPARTMENT") {
            state.departmentNames.push(action.payload);
            } else {
            state.reportNames.push(action.payload);
            }
        })

        .addCase(deleteName.fulfilled, (state, action) => {
            const { id, type } = action.payload;
            if (type === "DEPARTMENT") {
            state.departmentNames = state.departmentNames.filter(
                (i) => i.id !== id
            );
            } else {
            state.reportNames = state.reportNames.filter(
                (i) => i.id !== id
            );
            }
        });
    },
});

export const { addDepartment, addReport } = namesSlice.actions;
export default namesSlice.reducer;
