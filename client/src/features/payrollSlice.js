import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axiosInstance";

// Async Thunks
export const fetchComponents = createAsyncThunk("payroll/fetchComponents", async (_, { rejectWithValue }) => {
  try {
    const response = await API.get("/api/payroll/components");
    return response.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch components");
  }
});

export const addComponent = createAsyncThunk("payroll/addComponent", async (data, { rejectWithValue }) => {
  try {
    const response = await API.post("/api/payroll/components", data);
    return response.data; // { status, message, data }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to add component");
  }
});

export const assignSalary = createAsyncThunk("payroll/assignSalary", async ({ empId, structure }, { rejectWithValue }) => {
  try {
    const response = await API.post(`/api/payroll/assign/${empId}`, { structure });
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to assign salary");
  }
});

export const runPayroll = createAsyncThunk("payroll/generate", async ({ month, year }, { rejectWithValue }) => {
  try {
    const response = await API.post("/api/payroll/generate", { month, year });
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to generate payroll");
  }
});

export const fetchHistory = createAsyncThunk("payroll/fetchHistory", async (empId, { rejectWithValue }) => {
  try {
    const response = await API.get(`/api/payroll/history/${empId}`);
    return response.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch history");
  }
});

// Helper to fetch all employees list for assignment
export const fetchAllEmployees = createAsyncThunk("payroll/fetchAllEmployees", async (_, { rejectWithValue }) => {
  try {
    const response = await API.get("/api/employees/all");
    return response.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch employees");
  }
});

const payrollSlice = createSlice({
  name: "payroll",
  initialState: {
    components: [],
    history: [],
    employeesList: [], // For dropdown
    loading: false,
    error: null,
    success: null
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Components
      .addCase(fetchComponents.pending, (state) => { state.loading = true; })
      .addCase(fetchComponents.fulfilled, (state, action) => {
        state.loading = false;
        state.components = action.payload;
      })
      .addCase(fetchComponents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Component
      .addCase(addComponent.fulfilled, (state, action) => {
        state.components.push(action.payload.data);
        state.success = "Component added successfully";
      })
      // Assign Salary
      .addCase(assignSalary.fulfilled, (state) => {
        state.success = "Salary Assigned Successfully";
      })
      // Run Payroll
      .addCase(runPayroll.fulfilled, (state, action) => {
         state.success = action.payload.message;
      })
      // Fetch History
      .addCase(fetchHistory.fulfilled, (state, action) => {
          state.history = action.payload;
      })
      // Fetch All Employees
      .addCase(fetchAllEmployees.fulfilled, (state, action) => {
          state.employeesList = action.payload;
      });
  },
});

export const { clearMessages } = payrollSlice.actions;
export default payrollSlice.reducer;
