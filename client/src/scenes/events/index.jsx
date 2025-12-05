import Header from "../../Components/Header";
import { Button, Card, Grid } from "@mui/material";
import OAImage from "../../image/vyoobam tech.jpeg";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

const cards = [
  {
    title: "",
    bgImage: OAImage,
  },
  {
    title: "",
    bgImage: OAImage,
  },
];

const formOpen = () => {
  <form action="">
    <input type="text" />
  </form>
}

const Event = () => {
  const [ openForm, setOpenForm ] = useState(false);

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        padding: "120px 40px 20px 40px",
        boxSizing: "border-box",
      }}
    >
      <Header title="EVENTS" subtitle="Organisation Yearly Events" />
      <Button
        variant="contained"
        color="primary"
        sx={{ position: "relative", left: "100%" }}
        onClick={ formOpen }
      >
        <AddIcon />
      </Button>

      <Grid container spacing={2}>
        {cards.map(({ title, bgImage }) => (
          <Grid item key={title} xs={12} sm={6} md={3}>
            <Card
              sx={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: 3,
                boxShadow: 3,
                p: 2,
                textAlign: "center",
                height: 200,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            ></Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Event;
