import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

const StatCard = ({ icon, label, value }) => (
  <Card sx={{ borderRadius: 2, boxShadow: 3, minWidth: 250, maxWidth: 350 }}>
    <CardContent>
      <Box display="flex" alignItems="center" mb={1}>
        <Box sx={{ fontSize: 32, mr: 1 }}>{icon}</Box>
        <Typography variant="subtitle1" color="text.secondary">
          {label}
        </Typography>
      </Box>
      <Typography variant="h5" fontWeight="bold">
        {value}
      </Typography>
    </CardContent>
  </Card>
);

export default StatCard;
