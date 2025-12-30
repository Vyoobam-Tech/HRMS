import React, { useEffect, useState } from 'react'
import Header from '../../Components/Header'
import { Button, Card, CardContent, Typography, Stack, CardHeader, CardActions, IconButton, Paper } from '@mui/material'
import API from '../../api/axiosInstance';
import ApplyPolicyForm from '../../Components/ApplyPolicyForm';
import DownloadIcon from '@mui/icons-material/Download'
import DeleteIcon from "@mui/icons-material/Delete";
import { Box } from '@mui/system';

const index = () => {
    const [user, setUser] = useState(null);
    const [open, setOpen] = useState(false)
    const [policies, setPolicies] = useState([])


    useEffect(() => {
        fetchUser()
        fetchPolicies()
    }, [policies])

    const fetchUser = async () => {
        try {
            const response = await API.get("/auth/profile");
            if (response.data.status) {
                setUser(response.data.user);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const fetchPolicies = async () => {
        try{
            const res = await API.get("/api/policy")
            if(res.data.status){
                setPolicies(res.data.policies)
            }
        }catch(err){
            console.log(err)
        }
    }

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

    const handleDelete = async (id) => {
      try{
        await API.delete(`/api/policy/${id}`)
        setPolicies((prev) => prev.filter((p) => p.id !== id))
      }catch(err){
        console.log(err)
      }
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

        <ApplyPolicyForm  open={open} handleClose={() => setOpen(false)}/>
    </div>
  )
}

export default index