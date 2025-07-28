import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

const IncomeReports = () => {
  const [deals, setDeals] = useState([]);

  const incomeByMonth = deals.reduce((acc, deal) => {
    const date = dayjs(deal.date);
    const monthKey = date.format("YYYY-MM");

    if (!acc[monthKey]) {
      acc[monthKey] = 0;
    }

    acc[monthKey] += Number(deal.income || 0);
    return acc;
  }, {});

  useEffect(() => {
    const saved = localStorage.getItem("fundedDeals");
    const parsed = saved ? JSON.parse(saved) : [];
    setDeals(parsed);
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Income Reports
      </Typography>
    </Box>
  );
};

export default IncomeReports;
