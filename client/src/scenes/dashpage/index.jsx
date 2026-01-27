import { Box, Grid, Skeleton } from "@mui/material";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import ExposureOutlinedIcon from "@mui/icons-material/ExposureOutlined";
import DataUsageOutlinedIcon from "@mui/icons-material/DataUsageOutlined";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../App.css"; // Ensure this import is correct relative to the new structure if changed, but scenes/dashpage/index.jsx to App.css is ../../App.css
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from "../../features/auth/authSlice";
import { fetchDashboardStats } from "../../features/dashboardSlice";
import { fetchNotifications } from "../../features/notificationSlice";

// Components
import Post from "./Post";
import Notification from "./Notification";
import StatCard from "./StatCard";
import PayrollChart from "./PayrollChart";
import EmployeeStats from "./EmployeeStats";
import QuickActions from "./QuickActions";

const Dashpage = () => {
    const [dateValue, setDateValue] = useState(new Date());
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { stats } = useSelector((state) => state.dashboard);
    const notifications = useSelector((state) => state.notification.list);

    useEffect(() => {
        dispatch(fetchNotifications());
        dispatch(fetchProfile());
    }, [dispatch]);

    useEffect(() => {
        if (!user) return;
        dispatch(fetchDashboardStats(user.empid));
    }, [user, dispatch]);

    // Construct Stats Data
    const statCardsData = [
        {
            title: "Department",
            icon: <BusinessRoundedIcon fontSize="large" />,
            value: stats?.departments ?? 0,
            subtitle: "Total Departments",
            color: "#3498db"
            // path: "/department",
        },
        {
            title: "Payroll",
            icon: <PaymentOutlinedIcon fontSize="large" />,
            value: stats?.payroll?.totalNetPay ? `$${stats.payroll.totalNetPay.toLocaleString()}` : "$0",
            subtitle: "This Month (Estimated)",
            path: "/payroll",
            color: "#9b59b6"
        },
        {
            title: "Accounts",
            icon: <ExposureOutlinedIcon fontSize="large" />,
            value: "$42,562",
            subtitle: "Revenue",
            path: "/accounts",
            color: "#1abc9c"
        },
        ...(user?.role === "employee" ? [
            {
                title: "My Report",
                icon: <DataUsageOutlinedIcon fontSize="large" />,
                value: stats?.myactivity ?? 0,
                subtitle: "Activities Logged",
                path: "/activities",
                color: "#e67e22"
            },
        ] : [
            {
                title: "Overall Report",
                icon: <DataUsageOutlinedIcon fontSize="large" />,
                value: stats?.allactivitities ?? 0,
                subtitle: "Total Activities",
                path: "/allactivities",
                color: "#f1c40f"
            }
        ])
    ];

    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100%",
                padding: { xs: "20px", md: "40px" },
                paddingTop: "100px !important", // push down for navbar
                boxSizing: "border-box",
                backgroundColor: "#f4f6f8" // Subtle background color
            }}
        >
            <Box display="flex" flexDirection="column" gap={3}>
                
                {/* 1. Header & Notifications */}
                {notifications.length > 0 && <Notification />}
                
                {/* 2. Welcome/Post Section */}
                <Post user={user} />

                {/* 3. Quick Actions Bar (New Feature) */}
                <QuickActions />

                {/* 4. Key Metrics Grid */}
                <Grid container spacing={3}>
                    {
                        !stats ? (
                             Array.from(new Array(4)).map((_, index) => (
                                <Grid item key={index} xs={12} sm={6} md={3}>
                                    <Skeleton variant="rectangular" height={145} sx={{ borderRadius: 3 }} />
                                </Grid>
                            ))
                        ) : (
                        statCardsData.map((card, index) => (
                        <Grid item key={index} xs={12} sm={6} md={3}>
                            <StatCard {...card} />
                        </Grid>
                    )))}
                </Grid>

                {/* 5. Detailed Visualizations Grid */}
                <Grid container spacing={3} alignItems="stretch">
                    {/* Employee Count */}
                    <Grid item xs={12} md={3}>
                         {!stats ? (
                           <Skeleton variant="rectangular" height={340} sx={{ borderRadius: 3 }} />
                        ) : (
                         <EmployeeStats count={stats?.employees} />
                        )}
                    </Grid>

                    {/* Payroll Chart */}
                    <Grid item xs={12} md={5}>
                        {!stats ? (
                           <Skeleton variant="rectangular" height={340} sx={{ borderRadius: 3 }} />
                        ) : (
                            <PayrollChart data={stats?.payroll || { totalNetPay: 0, totalDeductions: 0 }} />
                        )}
                    </Grid>

                    {/* Calendar */}
                    <Grid item xs={12} md={4}>
                        <Box
                            sx={{
                                bgcolor: "white",
                                borderRadius: 3,
                                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                                p: 2,
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minHeight: "340px"
                            }}
                        >
                            <Calendar onChange={setDateValue} value={dateValue} />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Dashpage;

