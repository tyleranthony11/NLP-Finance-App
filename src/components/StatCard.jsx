import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

const StatCard = ({ icon, label, value }) => (
  <Card
    sx={{
      borderRadius: 3,
      border: "1px solid #2F3136",
      background:
        "linear-gradient(180deg, rgba(39,41,46,0.95) 0%, rgba(28,30,34,0.95) 100%)",
      boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
      minWidth: 250,
      maxWidth: 350,
      color: "#F5F5F6",
      transition: "all 0.2s ease",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 14px 28px rgba(0,0,0,0.35)",
        borderColor: "#42444A",
      },
    }}
  >
    <CardContent>
      <Box display="flex" alignItems="center" mb={1.25}>
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            mr: 1.25,
            bgcolor: "#1C1D21",
            border: "1px solid #34363B",
          }}
        >
          <Box sx={{ fontSize: 28, lineHeight: 1 }}>{icon}</Box>
        </Box>
        <Typography
          variant="overline"
          sx={{
            color: "#B8BBC1",
            letterSpacing: 0.8,
            lineHeight: 1.4,
          }}
        >
          {label}
        </Typography>
      </Box>
      <Typography
        variant="h4"
        fontWeight={800}
        sx={{ color: "#FFFFFF", textAlign: "center" }}
      >
        {value}
      </Typography>
    </CardContent>
  </Card>
);

export default StatCard;
