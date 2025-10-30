import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import ExposureOutlinedIcon from "@mui/icons-material/ExposureOutlined";
import DataUsageOutlinedIcon from "@mui/icons-material/DataUsageOutlined";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../App.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AgCharts } from "ag-charts-community";
import { border } from "@mui/system";
import axios from "axios";
import Post from "./Post";

const Dashpage = () => {
  const [value, setValue] = useState(new Date());
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try{
        const response = await axios.get("http://localhost:3000/auth/profile", {withCredentials: true})
        if(response.data.user){
          setUser(response.data.user)
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchUser()
  }, [])


  const [stats, setstats] = useState({
    departments: 0,
    // accounts: 0,
    // payroll: 0,
    myactivity: 0,
    allactivitities: 0,
    employees: 0
  })

  useEffect(() => {
    if(!user) return 
    const fetchStats = async () => {
    try{
      const [dep, myact, allact,emp] = await Promise.all([
        axios.get("http://localhost:3000/api/departments/all"),
        // axios.get("http://localhost:3000/api/accounts/all"),
        // axios.get("http://localhost:3000/api/payroll/all"),
        axios.get(`http://localhost:3000/api/activities/by-user/${user.empid}`),
        // axios.get("http://localhost:3000/api/activities/all"),
        axios.get("http://localhost:3000/api/activities/all"),
        axios.get("http://localhost:3000/api/employees/all")
      ])

      setstats({
        departments: dep.data.data.length,
        // accounts: acc.length,
        // payroll: prl.length,
        myactivity: myact.data.data.length,
        allactivitities: allact.data.data.length,
        employees: emp.data.data.length 
      })
    } catch(err){
      console.log(err)
    }
  }
  fetchStats()
  },[user])

  const cards = [
    {
      title: "Department",
      icon: <BusinessRoundedIcon fontSize="large" />,
      value: stats.departments,
      subtitle: "Totally",
      path: "/department",
    },
    {
      title: "Payroll",
      icon: <PaymentOutlinedIcon fontSize="large" />,
      value: "$12,000",
      subtitle: "This Month",
      path: "/payroll",
    },
    {
      title: "Accounts",
      icon: <ExposureOutlinedIcon fontSize="large" />,
      value: "$42,562",
      subtitle: "This Month",
      path: "/accounts",
    },
    ...(user?.role === "employee" ? [
      {
      title: "My Report",
      icon: <DataUsageOutlinedIcon fontSize="large" />,
      value: stats.myactivity,
      subtitle: "Activities Logged",
      path: "/activities",
    },
  ] : [
    {
      title: "Report",
      icon: <DataUsageOutlinedIcon fontSize="large" />,
      value: stats.allactivitities,
      subtitle: "Activities Logged",
      path: "/allactivities",
    }
  ])
  ]

  function getData() {
    return [
      { label: "Payroll", value: 50000 },
      { label: "Gross Salary", value: 17000 },
    ];
  }

  useEffect(() => {
    const data = getData();

    if (chartRef.current && chartRef.current.firstChild) {
      chartRef.current.innerHTML = "";
    }

    const usdShortFormatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
    });

    const options = {
      container: chartRef.current,
      series: [
        {
          data,
          type: "pie",
          calloutLabelKey: "label",
          angleKey: "value",
          fills: ["#34495e", "#94B4C1"],
          sectorLabel: {
            formatter: ({ datum }) => usdShortFormatter.format(datum.value),
          },
          tooltip: {
            renderer: ({ datum }) => ({
              title: datum.label,
              content: `Value: ${usdShortFormatter.format(datum.value)}`,
            }),
          },
        },
      ],
      legend: {
        enabled: false,
      },
    };

    AgCharts.create(options);
  }, []);

  return (
    <Box display="flex" flexDirection="column" paddingTop={15}>
      <Post user={user}/>
      <Grid container spacing={2}>
        {cards.map(({ title, icon, path, subtitle, value }) => (
          <Grid item key={title} xs={12} sm={6} md={3}>
            <Card
              onClick={() => navigate(path)}
              sx={{
                height: 145,
                borderRadius: 3,
                p: 2,
                cursor: "pointer",
                color: "#34495e",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >

              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  height: "100px",
                }}
              >
                <Box>{icon}</Box>
                <Typography variant="h6">{title}</Typography>
                <Typography variant="h5" fontWeight="bold">
                  {value}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  {subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="stretch"
        flexWrap="wrap"
        gap={2}
        my={3}
      >
        <Card
          sx={{
            flex: "1 1 20%",
            minWidth: "200px",
            height: "304px",
            borderRadius: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            p: 1,
          }}
        >
          <CardContent sx={{ color: "#34495e" }}>
            <Typography variant="h6">No. of Employees</Typography>
            <Box sx={{ paddingTop: "30px", marginLeft: "15px" }}>
              <PeopleAltRoundedIcon fontSize="large" />
              <Typography variant="h6">{stats.employees}</Typography>
              <Typography variant="h6">Total Employees</Typography>
            </Box>
          </CardContent>
        </Card>
        <Card
          sx={{
            flex: "2 1 50%",
            minWidth: "300px",
            height: "304px",
            borderRadius: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            p: 1,
          }}
        >
          <CardContent sx={{ color: "#34495e" }}>
            <Typography variant="h6">Payroll Details</Typography>
            <Box
              ref={chartRef}
              id="myChart"
              sx={{
                width: "95%",
                height: "250px",
              }}
            />
          </CardContent>
        </Card>

        <Card
          sx={{
            flex: "1 1 25%",
            minWidth: "300px",
            maxWidth: "350px",
            height: "290px",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
        >
          <Calendar onChange={setValue} value={value}/>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashpage;
