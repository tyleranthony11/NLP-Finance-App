import React from "react";
import { Grid, Paper, Typography } from "@mui/material";
import "./DashboardHome.css";

const DashboardHome = () => {
  const cards = [
    { title: "Active Listings", count: 24, color: "blue" },
    { title: "New Submissions", count: 5, color: "red" },
    { title: "Total Leads", count: 18, color: "green" },
    { title: "Funded Deals", count: 9, color: "purple" },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper className={`dashboard-card ${card.color}`} elevation={3}>
            <Typography variant="h6" className="dashboard-card-title">
              {card.title}
            </Typography>
            <Typography variant="h4" className="dashboard-card-count">
              {card.count}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardHome;
