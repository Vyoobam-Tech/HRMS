import Header from "../../components/Header";
import { Card, CardContent, List, Typography, Grid, Button } from "@mui/material";

const cards = [
  {
    title: "Role: Frontend Developer",
    subtitle1: "Experience: 0-1 Year",
    subtitle2: "Location: Kumbakonam/Chennai",
    subtitle3: "Vacancy: 05",
    subtitle4: "Must-Have: Proficiency in HTML, CSS and JavaScript."
  },
  {
    title: "Role: PHP Developer",
    subtitle1: "Experience: 0-1 Year",
    subtitle2: "Location: Kumbakonam/Chennai",
    subtitle3: "Vacancy: 01",
    subtitle4: "Must-Have: Proficient in PHP 5.x/7.x with hands-on experience working on legacy PHP applications."
  },
];

const JobPortal = () => {
  return (
    <div
      style={{
        height: 500,
        paddingTop: "50px",
        marginRight: "60px",
        marginLeft: "40px",
      }}
    >
      <Header title="JOB PORTAL" />

      <Grid container spacing={40}>
        {cards.map(({ title, subtitle1, subtitle2, subtitle3, subtitle4 }) => (
          <Grid item key={title} xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                p: 2,
                height: 250,
                width: 320,
                paddingTop: "-80px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                
              }}
            >
              <CardContent>
                <List>
                  <Typography variant="h7">{title}</Typography>
                </List>
                <List>
                  <Typography variant="h7">{subtitle1}</Typography>
                </List>
                <List>
                  <Typography variant="h7">{subtitle2}</Typography>
                </List>
                <List>
                  <Typography variant="h7">{subtitle3}</Typography>
                </List>
                <List>
                  <Typography variant="h7">{subtitle4}</Typography>
                </List>
                <Button sx={{marginLeft: "80%"}}>Apply</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default JobPortal;
