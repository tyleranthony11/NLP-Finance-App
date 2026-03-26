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
  container: {
    p: 3,
    pb: 4,
    minHeight: 0,
    height: "100%",
    overflowY: "auto",
    bgcolor: "#18191A",
    color: "#F5F5F6",
  },
  headerPanel: {
    mb: 2,
    p: 2,
    borderRadius: 3,
    border: "1px solid #2B2B2F",
    bgcolor: "#1F2023",
  },
  filterRow: {
    display: "flex",
    gap: 2,
    mt: 2,
    mb: 2,
    flexWrap: "wrap",
    justifyContent: "flex-start",
    p: 2,
    borderRadius: 3,
    border: "1px solid #2B2B2F",
    bgcolor: "#1F2023",
  },
  filterControl: { minWidth: 220 },
  selectLabelSx: {
    color: "#C7CAD1 !important",
    "&.Mui-focused": { color: "#F5F5F6 !important" },
  },
  viewModeLabelSx: {
    color: "#EB001B !important",
    "&.Mui-focused": { color: "#EB001B !important" },
  },
  selectSx: {
    "& .MuiInputLabel-root": { color: "#A5A7AC" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#F5F5F6" },
    "& .MuiOutlinedInput-root": {
      color: "#F5F5F6",
      "& fieldset": { borderColor: "#3A3B40" },
      "&:hover fieldset": { borderColor: "#EB001B" },
      "&.Mui-focused fieldset": { borderColor: "#EB001B" },
    },
    "& .MuiSelect-select": {
      color: "#F5F5F6 !important",
      WebkitTextFillColor: "#F5F5F6 !important",
    },
    "& .MuiOutlinedInput-input": {
      color: "#F5F5F6 !important",
      WebkitTextFillColor: "#F5F5F6 !important",
    },
    "& .MuiInputBase-input": {
      color: "#F5F5F6 !important",
      WebkitTextFillColor: "#F5F5F6 !important",
    },
    "& .MuiSvgIcon-root": { color: "#C7CAD1" },
  },
  viewModeSelectSx: {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#16171A",
      "& fieldset": { borderColor: "#2F3136" },
      "&:hover fieldset": { borderColor: "#3A3D43" },
      "&.Mui-focused fieldset": { borderColor: "#4B5563" },
    },
    "& .MuiSelect-select": {
      color: "#D1D5DB !important",
      WebkitTextFillColor: "#D1D5DB !important",
    },
    "& .MuiSvgIcon-root": { color: "#A5A7AC" },
  },
  statCards: {
    display: "flex",
    gap: 2,
    mb: 2,
    flexWrap: "wrap",
  },
  icon: { fontSize: 34, color: "#EB001B" },
  chartPanel: {
    borderRadius: 3,
    border: "1px solid #2B2B2F",
    bgcolor: "#1F2023",
    p: 2,
  },
  yearPickerWrap: {
    px: 1,
    py: 0.5,
    borderRadius: 2,
    border: "1px solid #2B2B2F",
    bgcolor: "#1F2023",
    "& .MuiTypography-root": { color: "#F5F5F6", fontWeight: 700 },
    "& .MuiIconButton-root, & .MuiSvgIcon-root": { color: "#F5F5F6" },
  },
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
      x: {
        grid: { color: "#2B2B2F" },
        ticks: { color: "#C7CAD1" },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#2B2B2F" },
        ticks: {
          color: "#C7CAD1",
          callback: (value) => `$${value.toLocaleString()}`,
        },
      },
    },
    plugins: {
      legend: {
        labels: { color: "#F5F5F6" },
      },
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
        backgroundColor: "#EB001B",
        order: 2,
      },
      {
        label: `Monthly Average`,
        data: averageIncomeByMonth,
        type: "line",
        borderColor: "#F59E0B",
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
          "#EB001B",
          "#F59E0B",
          "#22C55E",
          "#A855F7",
          "#F97316",
          "#06B6D4",
          "#84CC16",
          "#8B5CF6",
          "#F43F5E",
          "#14B8A6",
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
        backgroundColor: "#EB001B",
      },
    ],
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.headerPanel}>
        <Typography variant="h4" sx={{ mb: 0.25, fontWeight: 700 }}>
          Income Reports
        </Typography>
        <Typography variant="body2" sx={{ color: "#A5A7AC" }}>
          Track yearly performance by role and compare income trends.
        </Typography>
      </Box>

      {(viewMode === "dealer" || viewMode === "lender" || viewMode === "employee") && (
        <Box sx={styles.filterRow}>
        {viewMode === "dealer" && (
          <FormControl sx={styles.filterControl}>
            <InputLabel id="dealer-select-label" sx={styles.selectLabelSx}>
              Select Dealer
            </InputLabel>
            <Select
              size="small"
              labelId="dealer-select-label"
              value={selectedDealer}
              label="Select Dealer"
              sx={styles.selectSx}
              onChange={(e) => setSelectedDealer(e.target.value)}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: "#1F2023",
                    color: "#F5F5F6",
                    border: "1px solid #2B2B2F",
                  },
                },
              }}
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
          <FormControl sx={styles.filterControl}>
            <InputLabel id="lender-select-label" sx={styles.selectLabelSx}>
              Select Lender
            </InputLabel>
            <Select
              size="small"
              labelId="lender-select-label"
              value={selectedLender}
              label="Select Lender"
              sx={styles.selectSx}
              onChange={(e) => setSelectedLender(e.target.value)}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: "#1F2023",
                    color: "#F5F5F6",
                    border: "1px solid #2B2B2F",
                  },
                },
              }}
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
          <FormControl sx={styles.filterControl}>
            <InputLabel id="employee-select-label" sx={styles.selectLabelSx}>
              Select Employee
            </InputLabel>
            <Select
              size="small"
              labelId="employee-select-label"
              value={selectedEmployee}
              label="Select Employee"
              sx={styles.selectSx}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: "#1F2023",
                    color: "#F5F5F6",
                    border: "1px solid #2B2B2F",
                  },
                },
              }}
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
      )}

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
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", flexWrap: "wrap" }}>
              <Box sx={styles.yearPickerWrap}>
                <YearPicker value={selectedYear} onChange={setSelectedYear} />
              </Box>
              <FormControl sx={{ minWidth: 150, maxWidth: 170 }}>
                <InputLabel
                  id="view-select-label-marketplace"
                  shrink
                  sx={styles.viewModeLabelSx}
                >
                  View Mode
                </InputLabel>
                <Select
                  size="small"
                  labelId="view-select-label-marketplace"
                  value={viewMode}
                  label="View Mode"
                  sx={{
                    ...styles.selectSx,
                    ...styles.viewModeSelectSx,
                    "& .MuiSelect-select": {
                      pt: "10px",
                      pb: "8px",
                      color: "#D1D5DB !important",
                      WebkitTextFillColor: "#D1D5DB !important",
                    },
                  }}
                  onChange={(e) => {
                    setViewMode(e.target.value);
                    setSelectedDealer("");
                    setSelectedLender("");
                    setSelectedEmployee("");
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: "#1F2023",
                        color: "#F5F5F6",
                        border: "1px solid #2B2B2F",
                      },
                    },
                  }}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="dealer">By Dealer</MenuItem>
                  <MenuItem value="lender">By Lender</MenuItem>
                  <MenuItem value="employee">By Employee</MenuItem>
                  <MenuItem value="marketplace">Marketplace</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          <Box
            sx={{
              ...styles.chartPanel,
              maxWidth: 1100,
              width: "100%",
              height: 430,
            }}
          >
            <Bar
              data={marketplaceChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: "#F5F5F6" } } },
                scales: {
                  x: { grid: { color: "#2B2B2F" }, ticks: { color: "#C7CAD1" } },
                  y: {
                    beginAtZero: true,
                    grid: { color: "#2B2B2F" },
                    ticks: { color: "#C7CAD1" },
                  },
                },
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

          <Box sx={{ maxWidth: 1500, mx: "auto", mt: 1 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box sx={styles.yearPickerWrap}>
                <YearPicker value={selectedYear} onChange={setSelectedYear} />
              </Box>
              <FormControl sx={{ minWidth: 150, maxWidth: 170 }}>
                <InputLabel
                  id="view-select-label-default"
                  shrink
                  sx={styles.viewModeLabelSx}
                >
                  View Mode
                </InputLabel>
                <Select
                  size="small"
                  labelId="view-select-label-default"
                  value={viewMode}
                  label="View Mode"
                  sx={{
                    ...styles.selectSx,
                    ...styles.viewModeSelectSx,
                    "& .MuiSelect-select": {
                      pt: "10px",
                      pb: "8px",
                      color: "#D1D5DB !important",
                      WebkitTextFillColor: "#D1D5DB !important",
                    },
                  }}
                  onChange={(e) => {
                    setViewMode(e.target.value);
                    setSelectedDealer("");
                    setSelectedLender("");
                    setSelectedEmployee("");
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: "#1F2023",
                        color: "#F5F5F6",
                        border: "1px solid #2B2B2F",
                      },
                    },
                  }}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="dealer">By Dealer</MenuItem>
                  <MenuItem value="lender">By Lender</MenuItem>
                  <MenuItem value="employee">By Employee</MenuItem>
                  <MenuItem value="marketplace">Marketplace</MenuItem>
                </Select>
              </FormControl>
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
              <Box sx={{ ...styles.chartPanel, flex: 1, minWidth: 300, height: 430 }}>
                <Bar
                  data={chartData}
                  options={chartOptions}
                  key={selectedYear.year()}
                />
              </Box>

              <Box sx={{ ...styles.chartPanel, flex: 1, minWidth: 300, height: 430 }}>
                <Box
                  sx={{
                    flex: 1,
                    minWidth: 300,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    mb={2}
                    textAlign="center"
                    sx={{ color: "#F5F5F6", fontWeight: 600 }}
                  >
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
    </Box>
  );
};

export default IncomeReports;
