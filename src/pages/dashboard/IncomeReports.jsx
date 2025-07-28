import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

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

  const chartData = {
    labels: Object.keys(incomeByMonth),
    datasets: [
      {
        label: "Total Monthly Income",
        data: Object.keys(incomeByMonth)
          .sort()
          .map((month) => incomeByMonth[month]),
        backgroundColor: "#1976d2",
      },
    ],
  };

  useEffect(() => {
    const saved = localStorage.getItem("fundedDeals");
    const parsed = saved ? JSON.parse(saved) : [];
    setDeals(parsed);
  }, []);

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Bar data={chartData} />
    </Box>
  );
};

export default IncomeReports;
