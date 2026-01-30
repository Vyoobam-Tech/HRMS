import React, { useEffect, useState } from "react";
import Header from "../../Components/Header";
import {
  Button,
  Typography,
  Stack,
  IconButton,
  Paper,   
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";

import API, { BASE_URL } from "../../api/axiosInstance";
import ApplyPolicyForm from "../../Components/ApplyPolicyForm";
import MyDocumentsDialog from "../../Components/MyDocumentDialog";
import PolicyOutlinedIcon from '@mui/icons-material/PolicyOutlined';
import PlagiarismOutlinedIcon from '@mui/icons-material/PlagiarismOutlined';
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../../features/auth/authSlice";
import {
  deleteDocument,
  deletePolicy,
  fetchDocuments,
  fetchPolicies,
} from "../../features/policySlice";

const Index = () => {
  const [open, setOpen] = useState(false);
  const [docOpen, setDocOpen] = useState(false);
  const [tab, setTab] = useState(0);

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { policies, documents } = useSelector((state) => state.policy);

  /* -------------------- FETCH DATA -------------------- */
  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchPolicies());
  }, [dispatch]);

  useEffect(() => {
    if (user?.empid) {
      dispatch(fetchDocuments(user.empid));
    }
  }, [user, dispatch]);

  /* -------------------- HELPERS -------------------- */
  const documentFields = [
    { key: "photo", label: "Photo" },
    { key: "aadhar", label: "Aadhar" },
    { key: "pan", label: "PAN" },
    { key: "license", label: "License" },
  ];

  const TabPanel = ({ value, index, children }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ mt: 2 }}>{children}</Box>}
    </div>
  );

  /* -------------------- ACTIONS -------------------- */
  const handleDownload = async (fileName) => {
    const res = await API.get(`/api/policy/download/${fileName}`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
  };

  const handleDocumentDownload = async (fileName) => {
    const res = await API.get(`/uploads/employee-docs/${fileName}`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
  };

  const handleDelete = (id) => dispatch(deletePolicy(id));
  const handleDocumentDelete = (field) =>
    dispatch(deleteDocument({ empid: user.empid, field }));

  /* -------------------- UI -------------------- */
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "120px 40px 20px",
        boxSizing: "border-box",
      }}
    >
      <Header title="WORKPLACE ETHICS" />

      {/* ---------- TABS ---------- */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
      <Tabs
        value={tab}
        onChange={(e, newValue) => setTab(newValue)}
      >
        <Tab icon={<PolicyOutlinedIcon />} label="Policies" />
        <Tab icon={<PlagiarismOutlinedIcon />} label="My Documents" />
      </Tabs>
      </Box>

      {/* ================= POLICIES TAB ================= */}
      <TabPanel value={tab} index={0}>
        {user?.role === "superadmin" && (
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            sx={{ mb: 2 }}
          >
            Add Policy
          </Button>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 2,
          }}
        >
          {policies?.map((policy) => (
            <Paper key={policy.id} sx={{ p: 2, borderRadius: 2 }}>
              <Typography sx={{ mb: 2 }}>{policy.title}</Typography>

              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => handleDownload(policy.file_name)}
              >
                Download
              </Button>

              {user?.role === "superadmin" && (
                <IconButton
                  color="error"
                  onClick={() => handleDelete(policy.id)}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Paper>
          ))}
        </Box>
      </TabPanel>

      {/* ================= DOCUMENTS TAB ================= */}
      <TabPanel value={tab} index={1}>
        <Button
          variant="contained"
          onClick={() => setDocOpen(true)}
          sx={{ mb: 2 }}
        >
          Add My Document
        </Button>

        {!documents ? (
          <Typography>No documents uploaded</Typography>
        ) : (
          <Stack spacing={2}>
            {documentFields.some((d) => documents[d.key]) ? (
              documentFields.map(
                ({ key, label }) =>
                  documents[key] && (
                    <Stack
                      key={key}
                      direction="row"
                      spacing={2}
                      alignItems="center"
                    >
                      <Typography sx={{ width: 100 }}>
                        {label} :
                      </Typography>

                      <Button
                        variant="contained"
                        component="a"
                        href={`${BASE_URL}/uploads/employee-docs/${documents[key]}`}
                        target="_blank"
                      >
                        View
                      </Button>

                      <IconButton
                        onClick={() =>
                          handleDocumentDownload(documents[key])
                        }
                      >
                        <DownloadIcon />
                      </IconButton>

                      <IconButton
                        color="error"
                        onClick={() => handleDocumentDelete(key)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  )
              )
            ) : (
              <Typography color="text.secondary">
                No documents uploaded yet
              </Typography>
            )}
          </Stack>
        )}
      </TabPanel>

      {/* ---------- MODALS ---------- */}
      <ApplyPolicyForm open={open} handleClose={() => setOpen(false)} />
      <MyDocumentsDialog
        user={user}
        open={docOpen}
        onClose={() => setDocOpen(false)}
      />
    </div>
  );
};

export default Index;