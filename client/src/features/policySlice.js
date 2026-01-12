import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axiosInstance";

export const fetchPolicies = createAsyncThunk(
    "policy/fetchPolicies",
    async (_, { rejectWithValue }) => {
        try {
        const res = await API.get("/api/policy");
        if(res.data.status){
            return res.data.policies;
        }
        return rejectWithValue("Failed to fetch policies");
        } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
        }
    }
)

export const addPolicy = createAsyncThunk(
    "policy/addPolicy",
    async (formData, { rejectWithValue }) => {
        try {
        const res = await API.post("/api/policy", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        if (!res.data?.policy) {
            return rejectWithValue("Failed to add policy");
        }

        return res.data.policy;
        } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
        }
    }
);


export const addDocument = createAsyncThunk(
    "policy/addDocument",
    async ({ empid, formData }, { rejectWithValue }) => {
        try {
        formData.append("empid", empid)

        const res = await API.post(
            "/api/document/upload",
            formData,
            {
            headers: { "Content-Type": "multipart/form-data" },
            }
        );

        return res.data;
        } catch (err) {
        return rejectWithValue(
            err.response?.data?.message || err.message
        );
        }
    }
);


export const fetchDocuments = createAsyncThunk(
    "document/fetchDocuments",
    async (empid, { rejectWithValue }) => {
        try {
        const res = await API.get(`/api/document/${empid}`);
        return res.data.data;
        } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
        }
    }
)

export const deletePolicy = createAsyncThunk(
    "policy/deletePolicy",
    async (id, { rejectWithValue }) => {
        try {
        await API.delete(`/api/policy/${id}`);
        return id
        } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const deleteDocument = createAsyncThunk(
    "policy/deleteDocument",
    async ({ empid, field }, { rejectWithValue }) => {
        try {
        await API.delete(`/api/document/${empid}/${field}`);
        return field
        } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
        }
    }
)


const policySlice = createSlice({
    name: "policy",
    initialState: {
        policies: [],
        documents: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearDocuments: (state) => {
        state.documents = null;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchPolicies.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchPolicies.fulfilled, (state, action) => {
            state.loading = false;
            state.policies = action.payload;
        })
        .addCase(fetchPolicies.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        .addCase(addPolicy.fulfilled, (state, action) => {
            state.policies.unshift(action.payload);
        })

        .addCase(fetchDocuments.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchDocuments.fulfilled, (state, action) => {
            state.loading = false;
            state.documents = action.payload;
        })
        .addCase(fetchDocuments.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        .addCase(addDocument.fulfilled, (state, action) => {
            state.documents = action.payload.data || action.payload;
        })


        .addCase(deletePolicy.fulfilled, (state, action) => {
            state.policies = state.policies.filter(
            (p) => p.id !== action.payload
            )
        })

        .addCase(deleteDocument.fulfilled, (state, action) => {
            if (state.documents) {
            state.documents[action.payload] = null;
            }
        });
    },
});

export const { clearDocuments } = policySlice.actions;
export default policySlice.reducer

