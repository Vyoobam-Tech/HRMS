import React, { useEffect, useState } from 'react'
import Header from '../../Components/Header'
import { Button, Typography, Stack, IconButton, Paper } from '@mui/material'
import API, { BASE_URL } from '../../api/axiosInstance';
import ApplyPolicyForm from '../../Components/ApplyPolicyForm';
import DownloadIcon from '@mui/icons-material/Download'
import DeleteIcon from "@mui/icons-material/Delete";
import { Box } from '@mui/system';
import MyDocumentsDialog from '../../Components/MyDocumentDialog';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../../features/auth/authSlice';
import { deleteDocument, deletePolicy, fetchDocuments, fetchPolicies } from '../../features/policySlice';

const index = () => {
    const [open, setOpen] = useState(false)
    const [docOpen, setDocOpen] = useState(false);

    const dispatch = useDispatch()

    const { user, loading: authLoading, error: authError } = useSelector(
      (state) => state.auth
    )

    const {policies, documents, loading} = useSelector((state) => state.policy)

    useEffect(() => {
        dispatch(fetchProfile());
      }, [dispatch]);

      useEffect(() => {
        dispatch(fetchPolicies())
      }, [dispatch]);

      useEffect(() => {
        if (user?.empid) {
          dispatch(fetchDocuments(user.empid))
        }
      }, [user]);


    const handleDownload = async (fileName) => {
      try{
        const res = await API.get(`/api/policy/download/${fileName}`,
          {responseType: "blob"}
        )

        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error("Download failed", error);
      }
    }

    const handleDocumentDownload = async (fileName) => {
      try {
        const res = await API.get(
          `/uploads/employee-docs/${fileName}`,
          { responseType: "blob" }
        );

        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (err) {
        console.log("Download failed", err);
      }
    };


    const handleDelete = async (id) => {
      dispatch(deletePolicy(id))
    }

    const handleDocumentDelete = async (field) => {
      dispatch(deleteDocument({ empid: user.empid, field }))
    }

  return (
    <div
        style={{
        minHeight: "100vh",
        width: "100%",
        padding: "120px 40px 20px 40px",
        boxSizing: "border-box",
        }}
    >
        <Header title="WORKPLACE ETHICS"/>
        {user?.role === "superadmin" && (
            <>
                <Button
                variant='contained'
                color='primary'
                onClick={() => setOpen(true)}
                sx={{ mb: 2 }}
                >
                Add Policy
                </Button>
            </>
        )}
          <Typography variant="h6" gutterBottom>
              Policies
          </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 2,
            mt: 2
          }}
        >
          {policies.map((policy) => (
            <Paper
              key={policy.id}
              elevation={3}
              sx={{
              p: 2,
              width: 220,
              bgcolor: '#f5f5f5',
              borderRadius: 2,
              cursor: "pointer",
              position: "relative",
            }}>
              <Typography sx={{ mb: 2 }}>
                {policy.title}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => handleDownload(policy.file_name)}
              >
                Download
              </Button>

              {user?.role === "superadmin" && (
                <IconButton color="error" aria-label="delete" onClick={() => handleDelete(policy.id)}>
                  <DeleteIcon />
                </IconButton>
              )}
            </Paper>
          ))}
        </Box>

        <Button
                variant='contained'
                color='primary'
                onClick={() => setDocOpen(true)}
                sx={{ mt: 4, mb: 2 }}
          >
            Add My document
        </Button>


        {documents && (
          <Box>
            <Typography variant="h6" gutterBottom>
              My Documents
            </Typography>

            <Stack spacing={1}>
              {documents.photo && (
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography sx={{ width: 100 }}>Photo :</Typography>
                  <Button
                    variant="contained"
                    component="a"
                    href={`${BASE_URL}/uploads/employee-docs/${documents.photo}`}
                    target="_blank"
                    rel="noreferrer"
                    sx={{
                      textTransform: "none",
                      color: "#fff",
                      textDecoration: "none",
                    }}
                  >
                    View
                  </Button>

                  <Button
                    onClick={() => handleDocumentDownload(documents.photo)}
                  >
                    <DownloadIcon />
                  </Button>
                  <IconButton color="error" aria-label="delete" onClick={() => handleDocumentDelete("photo")}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              )}

              {documents.aadhar && (
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography sx={{ width: 100 }}>Aadhar :</Typography>
                  <Button
                    variant="contained"
                    component="a"
                    href={`${BASE_URL}/uploads/employee-docs/${documents.aadhar}`}
                    target="_blank"
                    rel="noreferrer"
                    sx={{
                      textTransform: "none",
                      color: "#fff",
                      textDecoration: "none",
                    }}
                  >
                    View
                  </Button>
                  <Button
                    onClick={() => handleDocumentDownload(documents.aadhar)}
                  >
                    <DownloadIcon />
                  </Button>
                  <IconButton color="error" aria-label="delete" onClick={() => handleDocumentDelete("aadhar")}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              )}

              {documents.pan && (
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography sx={{ width: 100 }}>PAN :</Typography>
                  <Button
                    variant="contained"
                    component="a"
                    href={`${BASE_URL}/uploads/employee-docs/${documents.pan}`}
                    target="_blank"
                    rel="noreferrer"
                    sx={{
                      textTransform: "none",
                      color: "#fff",
                      textDecoration: "none",
                    }}
                  >
                    View
                  </Button>
                  <Button
                    onClick={() => handleDocumentDownload(documents.pan)}
                  >
                    <DownloadIcon />
                  </Button>
                  <IconButton color="error" aria-label="delete" onClick={() => handleDocumentDelete("pan")}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              )}

              {documents.license && (
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography sx={{ width: 100 }}>License :</Typography>
                  <Button
                    variant="contained"
                    component="a"
                    href={`${BASE_URL}/uploads/employee-docs/${documents.license}`}
                    target="_blank"
                    rel="noreferrer"
                    sx={{
                      textTransform: "none",
                      color: "#fff",
                      textDecoration: "none",
                    }}
                  >
                    View
                  </Button>
                  <Button
                    onClick={() => handleDocumentDownload(documents.license)}
                  >
                    <DownloadIcon />
                  </Button>
                  <IconButton color="error" aria-label="delete" onClick={() => handleDocumentDelete("license")}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              )}
            </Stack>
          </Box>
        )}

        <ApplyPolicyForm  open={open} handleClose={() => setOpen(false)}/>
        <MyDocumentsDialog user={user} open={docOpen}onClose={() => setDocOpen(false)}/>

    </div>
  )
}

export default index