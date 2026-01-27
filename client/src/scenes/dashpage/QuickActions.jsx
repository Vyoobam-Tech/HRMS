import { Box, Paper, Typography, IconButton, Tooltip } from "@mui/material";
import AddTaskIcon from '@mui/icons-material/AddTask';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
    const navigate = useNavigate();

    const actions = [
        { label: "Apply Leave", icon: <EventAvailableIcon />, path: "/emp-holidays", color: "#e67e22" },
        { label: "New Ticket", icon: <ConfirmationNumberIcon />, path: "/tickets", color: "#e74c3c" },
        { label: "My Tasks", icon: <AddTaskIcon />, path: "/activities", color: "#2ecc71" },
    ];

    return (
        <Paper 
            elevation={0} 
            sx={{ 
                p: 2, 
                borderRadius: 3, 
                mb: 3, 
                bgcolor: "white", 
                border: "1px solid #eee",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
            }}
        >
            <Typography variant="h6" fontWeight="600" color="#34495e">
                Quick Actions
            </Typography>
            <Box display="flex" gap={2}>
                {actions.map((action) => (
                    <Tooltip key={action.label} title={action.label}>
                        <IconButton 
                            onClick={() => navigate(action.path)}
                            sx={{ 
                                bgcolor: `${action.color}15`, 
                                color: action.color,
                                "&:hover": { bgcolor: `${action.color}25` }
                            }}
                        >
                            {action.icon}
                        </IconButton>
                    </Tooltip>
                ))}
            </Box>
        </Paper>
    );
};

export default QuickActions;
