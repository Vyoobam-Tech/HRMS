import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../api/axiosInstance";


export const assignTask = createAsyncThunk(
    "task/assignTask",
    async (taskData, { rejectWithValue }) => {
        try {
        const res = await API.post("/api/tasks", taskData);
        return res.data;
        } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
        }
    }
)

export const fetchTasksByEmpId = createAsyncThunk(
    "task/fetchTasksByEmpId",
    async (empid, { rejectWithValue }) => {
        try {
        const res = await API.get(`/api/tasks/${empid}`);
        return res.data;
        } catch (err) {
        return rejectWithValue("Unable to fetch tasks");
        }
    }
);

export const fetchAllTasks = createAsyncThunk(
    "task/fetchAllTasks",
    async (_, { rejectWithValue }) => {
        try {
        const res = await API.get("/api/tasks");
        return res.data
        } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
        }
    }
)

export const updateTaskStatus = createAsyncThunk(
    "task/updateTaskStatus",
    async ({ taskId, status }, { rejectWithValue }) => {
        try {
        const res = await API.put(`/api/tasks/${taskId}/status`, { status });
        return res.data;
        } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
        }
    }
);


export const deleteTasks = createAsyncThunk(
    "task/deleteTasks",
    async (id, { rejectWithValue }) => {
        try {
        await API.delete(`/api/tasks/${id}`);
        return id
        } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
        }
    }
)

const taskSlice = createSlice({
    name: "task",
    initialState: {
        all: [],
        list: [],
        loading: false,
        error: null,
        assignStatus: "idle",
        assignError: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(assignTask.pending, (state) => {
            state.assignStatus = "loading";
            state.assignError = null;
        })
        .addCase(assignTask.fulfilled, (state, action) => {
            state.assignStatus = "succeeded";
            state.all.push(action.payload);
        })
        .addCase(assignTask.rejected, (state, action) => {
            state.assignStatus = "failed";
            state.assignError = action.payload.message;
        })

    //   // Fetch all tasks
    //   .addCase(fetchAllTasks.pending, (state) => {
    //     state.status = "loading";
    //     state.error = null;
    //   })
    //   .addCase(fetchAllTasks.fulfilled, (state, action) => {
    //     state.status = "succeeded";
    //     state.all = action.payload;
    //   })
    //   .addCase(fetchAllTasks.rejected, (state, action) => {
    //     state.status = "failed";
    //     state.error = action.payload.message;
    //   });

        .addCase(fetchTasksByEmpId.pending, (state) => {
        state.loading = true;
        })
        .addCase(fetchTasksByEmpId.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        })
        .addCase(fetchTasksByEmpId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        })

        .addCase(fetchAllTasks.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchAllTasks.fulfilled, (state, action) => {
            state.loading = false;
            state.all = action.payload;
        })
        .addCase(fetchAllTasks.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        .addCase(updateTaskStatus.fulfilled, (state, action) => {
            state.list = state.list.map((task) =>
                task.taskId === action.payload.taskId ? action.payload : task
            );

            state.all = state.all.map((task) =>
                task.taskId === action.payload.taskId ? action.payload : task
            )
        })


        .addCase(deleteTasks.fulfilled, (state, action) => {
        state.all = state.all.filter(
            (task) => task.id !== action.payload && task.taskId !== action.payload
        )
        })

    },
});
  export default taskSlice.reducer;
