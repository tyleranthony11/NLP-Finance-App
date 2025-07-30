import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import YearPicker from "../../components/YearPicker";
import StatCard from "../../components/StatCard";
import HandshakeIcon from "@mui/icons-material/Handshake";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";

ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

const styles = {
  statCards: {
    display: "flex",
    justifyContent: "center",
    gap: 4,
    mb: 4,
    flexWrap: "wrap",
  },
  icon: { fontSize: 32 },
};

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

  const incomeTypeSums = {
    Brokerage: 0,
    Life: 0,
    AH: 0,
    CI: 0,
    GAP: 0,
    Warranty: 0,
    BankReserve: 0,
    DealerReserve: 0,
    OtherFI: 0,
    NLPReserve: 0,
  };

  filteredDeals.forEach((deal) => {
    incomeTypeSums.Brokerage += Number(deal.brokerageFee || 0);
    incomeTypeSums.Life += Number(deal.lifeInsurance || 0);
    incomeTypeSums.AH += Number(deal.ahInsurance || 0);
    incomeTypeSums.CI += Number(deal.ciInsurance || 0);
    incomeTypeSums.GAP += Number(deal.gapInsurance || 0);
    incomeTypeSums.Warranty += Number(deal.warranty || 0);
    incomeTypeSums.BankReserve += Number(deal.bankReserve || 0);
    incomeTypeSums.DealerReserve += Number(deal.dealerReserve || 0);
    incomeTypeSums.OtherFI += Number(deal.otherFI || 0);
    incomeTypeSums.NLPReserve -= Number(deal.nlpReserve || 0);
  });

  const totalDeals = filteredDeals.length;
  const totalIncome = filteredDeals.reduce(
    (sum, deal) => sum + Number(deal.income || 0),
    0
  );

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

  const previousYears = deals.filter((deal) => {
    const date = dayjs(deal.date);
    return date.year() < selectedYear.year();
  });

  const incomeSums = {};
  const incomeCounts = {};

  previousYears.forEach((deal) => {
    const date = dayjs(deal.date);
    const month = date.format("MMM");
    incomeSums[month] = (incomeSums[month] || 0) + Number(deal.income || 0);
    incomeCounts[month] = (incomeCounts[month] || 0) + 1;
  });

  const averageIncomeByMonth = allMonths.map((month) => {
    const total = incomeSums[month] || 0;
    const count = incomeCounts[month] || 0;
    return count > 0 ? total / count : 0;
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const chartData = {
    labels: allMonths,
    datasets: [
      {
        label: `Monthly Income - ${selectedYear.year()}`,
        data: allMonths.map((month) => incomeByMonth[month] || 0),
        backgroundColor: "#1976d2",
        order: 2,
      },
      {
        label: `Monthly Average - ${selectedYear.year()}`,
        data: averageIncomeByMonth,
        type: "line",
        borderColor: "#f57c00",
        borderWidth: 2,
        fill: false,
        pointRadius: 3,
        tension: 0.3,
        order: 1,
      },
    ],
  };

  const pieChartData = {
    labels: Object.keys(incomeTypeSums),
    datasets: [
      {
        label: `Income Breakdown - ${selectedYear.year()}`,
        data: Object.values(incomeTypeSums),
        backgroundColor: [
          "#1976d2",
          "#f57c00",
          "#4caf50",
          "#ab47bc",
          "#000000ff",
          "#26c6da",
          "#9ccc65",
          "#7e57c2",
          "#ffa726",
          "#ef5350",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <Typography variant="h4" fontWeight="bold">
        Income Reports
      </Typography>
      <Box sx={styles.statCards}>
        <StatCard
          icon={<HandshakeIcon sx={styles.icon} />}
          label="Number of Deals"
          value={totalDeals}
        />
        <StatCard
          icon={<MonetizationOnIcon sx={styles.icon} />}
          label="Total Income"
          value={`$${totalIncome.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
        />
        <StatCard
          icon={<MonetizationOnIcon sx={styles.icon} />}
          label="Total Income"
          value={`$${totalIncome.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
        />
      </Box>

      <Box sx={{ maxWidth: 1500, mx: "auto", mt: 4, p: 2 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <YearPicker value={selectedYear} onChange={setSelectedYear} />
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 4,
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ flex: 1, minWidth: 300, height: 400 }}>
            <Bar
              data={chartData}
              options={chartOptions}
              key={selectedYear.year()}
            />
          </Box>

          <Box
            sx={{
              flex: 1,
              minWidth: 300,
              maxWidth: 400,
              height: 400,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Pie data={pieChartData} key={`pie-${selectedYear.year()}`} />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default IncomeReports;
