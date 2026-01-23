import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
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
import EqualizerIcon from "@mui/icons-material/Equalizer";

ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
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
  const [listings, setListings] = useState([]);
  const [selectedYear, setSelectedYear] = useState(dayjs());

  const [viewMode, setViewMode] = useState("all");
  const [selectedDealer, setSelectedDealer] = useState("");
  const [selectedLender, setSelectedLender] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/funded-deals`,
        );
        const json = await res.json();

        if (json.success) {
          setDeals(json.data);
        } else {
          console.error("Failed to load funded deals", json);
        }
      } catch (err) {
        console.error("Failed to load funded deals", err);
      }
    };

    const savedListings = localStorage.getItem("listings");
    setListings(savedListings ? JSON.parse(savedListings) : []);

    fetchDeals();
  }, []);

  const filteredDeals = deals.filter((deal) => {
    const date = dayjs(deal.dealDate);
    return date.year() === selectedYear.year();
  });

  const filteredListings = listings.filter((listing) => {
    const date = dayjs(listing.date);
    return date.year() === selectedYear.year();
  });

  const uniqueDealers = [
    ...new Set(filteredDeals.map((d) => d.dealerName).filter(Boolean)),
  ];
  const uniqueLenders = [
    ...new Set(filteredDeals.map((d) => d.lenderName).filter(Boolean)),
  ];
  const uniqueEmployees = [
    ...new Set(filteredDeals.map((d) => d.employeeName).filter(Boolean)),
  ];

  const dealsInView = filteredDeals.filter((deal) => {
    if (viewMode === "dealer" && selectedDealer)
      return deal.dealerName === selectedDealer;
    if (viewMode === "lender" && selectedLender)
      return deal.lenderName === selectedLender;
    if (viewMode === "employee" && selectedEmployee)
      return deal.employeeName === selectedEmployee;
    return true;
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

  dealsInView.forEach((deal) => {
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

  const totalDeals = dealsInView.length;
  const totalIncome = dealsInView.reduce(
    (sum, deal) => sum + Number(deal.income || 0),
    0,
  );
  const avgIncome = totalDeals > 0 ? totalIncome / totalDeals : 0;

  const incomeByMonth = dealsInView.reduce((acc, deal) => {
    const date = dayjs(deal.dealDate);
    const month = date.format("MMM");
    acc[month] = (acc[month] || 0) + Number(deal.income || 0);
    return acc;
  }, {});

  const adsByMonth = filteredListings.reduce((acc, listing) => {
    const month = dayjs(listing.date).format("MMM");
    acc[month] = (acc[month] || 0) + 1;
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
    const date = dayjs(deal.dealDate);
    return date.year() < selectedYear.year();
  });

  const incomeSums = {};
  const incomeCounts = {};

  previousYears.forEach((deal) => {
    const date = dayjs(deal.dealDate);
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
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const val = ctx.raw || 0;
            return `$${val.toLocaleString()}`;
          },
        },
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
        label: `Monthly Average`,
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
          "#ff7043",
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

  const marketplaceChartData = {
    labels: allMonths,
    datasets: [
      {
        label: `New Ads Posted - ${selectedYear.year()}`,
        data: allMonths.map((month) => adsByMonth[month] || 0),
        backgroundColor: "#1976d2",
      },
    ],
  };

  return (
    <>
      <Typography variant="h4" fontWeight="bold">
        Income Reports
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mt: 2,
          mb: 2,
          flexWrap: "wrap",
          justifyContent: "flex-start",
        }}
      >
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="view-select-label">View Mode</InputLabel>
          <Select
            labelId="view-select-label"
            value={viewMode}
            label="View Mode"
            onChange={(e) => {
              setViewMode(e.target.value);
              setSelectedDealer("");
              setSelectedLender("");
              setSelectedEmployee("");
            }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="dealer">By Dealer</MenuItem>
            <MenuItem value="lender">By Lender</MenuItem>
            <MenuItem value="employee">By Employee</MenuItem>
            <MenuItem value="marketplace">Marketplace</MenuItem>
          </Select>
        </FormControl>

        {viewMode === "dealer" && (
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="dealer-select-label">Select Dealer</InputLabel>
            <Select
              labelId="dealer-select-label"
              value={selectedDealer}
              label="Select Dealer"
              onChange={(e) => setSelectedDealer(e.target.value)}
            >
              <MenuItem value="">All Dealers</MenuItem>
              {uniqueDealers.map((dealer) => (
                <MenuItem key={dealer} value={dealer}>
                  {dealer}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {viewMode === "lender" && (
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="lender-select-label">Select Lender</InputLabel>
            <Select
              labelId="lender-select-label"
              value={selectedLender}
              label="Select Lender"
              onChange={(e) => setSelectedLender(e.target.value)}
            >
              <MenuItem value="">All Lenders</MenuItem>
              {uniqueLenders.map((lender) => (
                <MenuItem key={lender} value={lender}>
                  {lender}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {viewMode === "employee" && (
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="employee-select-label">Select Employee</InputLabel>
            <Select
              labelId="employee-select-label"
              value={selectedEmployee}
              label="Select Employee"
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <MenuItem value="">All Employees</MenuItem>
              {uniqueEmployees.map((employee) => (
                <MenuItem key={employee} value={employee}>
                  {employee}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      {viewMode === "marketplace" ? (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mb: 5,
              flexWrap: "wrap",
            }}
          >
            <StatCard
              icon={<MonetizationOnIcon sx={styles.icon} />}
              label={`Total Ads - ${selectedYear.year()}`}
              value={allMonths.reduce(
                (sum, month) => sum + (adsByMonth[month] || 0),
                0,
              )}
            />
            <Box sx={{ alignSelf: "flex-start" }}>
              <YearPicker value={selectedYear} onChange={setSelectedYear} />
            </Box>
          </Box>
          <Box sx={{ flex: 1, minWidth: 300, height: 400, maxWidth: 1000 }}>
            <Bar
              data={marketplaceChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true } },
              }}
              key={`marketplace-${selectedYear.year()}`}
            />
          </Box>
        </>
      ) : (
        <>
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
              icon={<EqualizerIcon sx={styles.icon} />}
              label="Avg Income per Deal"
              value={`$${avgIncome.toLocaleString(undefined, {
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
                  height: 400,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    minWidth: 300,
                    height: 400,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6" mb={2} textAlign="center">
                    Income Breakdown by Type - {selectedYear.year()}
                  </Typography>
                  <Box sx={{ width: "100%", flex: 1 }}>
                    <Pie
                      data={pieChartData}
                      key={`pie-${selectedYear.year()}`}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

export default IncomeReports;
