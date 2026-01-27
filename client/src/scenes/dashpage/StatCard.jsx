import { Card, CardContent, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const StatCard = ({ title, value, subtitle, icon, path, color = "#34495e" }) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => path && navigate(path)}
      sx={{
        height: 145,
        borderRadius: 3,
        p: 2,
        cursor: path ? "pointer" : "default",
        color: color,
        transition: "transform 0.2s, box-shadow 0.2s",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        "&:hover": {
          transform: path ? "translateY(-5px)" : "none",
          boxShadow: path ? "0 8px 20px rgba(0,0,0,0.12)" : "0 4px 12px rgba(0,0,0,0.05)",
        },
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
          height: "100%",
          padding: "0 !important"
        }}
      >
        <Box 
          sx={{ 
            p: 1, 
            borderRadius: "12px", 
            backgroundColor: `${color}15`, // 10% opacity
            color: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {icon}
        </Box>
        <Box mt={2}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h5" fontWeight="bold">
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" sx={{ opacity: 0.8, display: "block", mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
