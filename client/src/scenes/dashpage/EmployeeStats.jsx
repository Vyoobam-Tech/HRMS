import { Card, CardContent, Typography, Box } from "@mui/material";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";

const EmployeeStats = ({ count }) => {
  return (
    <Card
      sx={{
        height: "100%",
        minHeight: "340px", 
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        background: "linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Decorative Circle */}
      <Box 
        sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 150,
            height: 150,
            borderRadius: "50%",
            backgroundColor: "rgba(52, 73, 94, 0.05)"
        }}
      />

      <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", zIndex: 1 }}>
        <Typography variant="h6" color="#34495e" fontWeight="600">
          Workforce
        </Typography>
        
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", flexGrow: 1 }}>
          <Box 
            sx={{ 
                p: 3, 
                borderRadius: "50%", 
                backgroundColor: "rgba(52, 73, 94, 0.1)", 
                mb: 2,
                color: "#34495e"
            }}
          >
            <PeopleAltRoundedIcon sx={{ fontSize: "3rem" }} />
          </Box>
          <Typography variant="h3" fontWeight="bold" color="#34495e">
            {count ?? 0}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Active Employees
          </Typography>
        </Box>
        
        <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #eee", width: "100%" }}>
            <Typography variant="caption" color="textSecondary" align="center" component="div">
                Updated just now
            </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EmployeeStats;
