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
import YearPicker from "../../components/YearPicker";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const IncomeReports = () => {
  const [deals, setDeals] = useState([]);
  const [selectedYear, setSelectedYear] = useState(dayjs());

  useEffect(() => {
    const saved = localStorage.getItem("fundedDeals");
    const parsed = saved ? JSON.parse(saved) : [];
    setDeals(parsed);
  }, []);

  const filteredDeals = deals.filter((deal) => {
    const date = dayjs(deal.date);
    return date.year() === selectedYear.year();
  });

  const incomeByMonth = filteredDeals.reduce((acc, deal) => {
    const date = dayjs(deal.date);
    const month = date.format("MMM");
    acc[month] = (acc[month] || 0) + Number(deal.income || 0);
    return acc;
  }, {});

  const allMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const chartData = {
    labels: allMonths,
    datasets: [
      {
        label: `Monthly Income - ${selectedYear.year()}`,
        data: allMonths.map((month) => incomeByMonth[month] || 0),
        backgroundColor: "#1976d2",
      },
    ],
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, p: 2 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Income Reports</Typography>
        <YearPicker value={selectedYear} onChange={setSelectedYear} />
      </Box>
      <Bar data={chartData} />
    </Box>
  );
};

export default IncomeReports;
