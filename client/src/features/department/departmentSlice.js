import { createAsyncThunk, createSlice, isRejectedWithValue } from "@reduxjs/toolkit";
import API from "../../api/axiosInstance";

export const fetchDepartments = createAsyncThunk(
    "department/fetchAll",
    async (_, {rejectWithValue}) => {
        try{
            const res = await API.get("/api/departments/all")
            return res.data.data
        }catch(err){
            return rejectWithValue(err.response?.data)
        }
    }
)

export const addDepartment = createAsyncThunk(
    "department/add",
    async (payload, {rejectWithValue}) => {
        try{
            const res = await API.post("/api/departments", payload)
            return res.data.data
        }catch(err){
            return rejectWithValue(err.response?.data)
        }
    }
)

export const updateDepartment = createAsyncThunk(
    "department/update",
    async ({id, values}, {rejectWithValue}) => {
        try{
            const res = await API.put(`/api/departments/update/${id}`, values)
            return res.data.data
        }catch(err){
            return rejectWithValue(err.response?.data)
        }
    }
)

export const deleteDepartment = createAsyncThunk(
    "department/delete",
    async (id, {rejectWithValue}) => {
        try{
            await API.delete(`/api/departments/delete/${id}`)
            return id
        }catch(err){
            return rejectWithValue(err.response?.data)
        }
    }
)

const departmentSlice = createSlice({
    name: "department",
    initialState: {
        list: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

        .addCase(fetchDepartments.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchDepartments.fulfilled, (state, action) => {
            state.loading = false
            state.list = action.payload
        })
        .addCase(fetchDepartments.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })

        .addCase(addDepartment.fulfilled, (state, action) => {
            state.list.push(action.payload)
        })

        .addCase(updateDepartment.fulfilled, (state, action) => {
            const index = state.list.findIndex(d => d.id === action.payload.id)
            if(index !== -1) state.list[index] = action.payload
        })

        .addCase(deleteDepartment.fulfilled, (state, action) => {
            state.list = state.list.filter(d => d.id !== action.payload)
        })
    }
})

export default departmentSlice.reducer