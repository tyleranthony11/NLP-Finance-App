import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AddDealModal from "../../components/AddDealModal";
import "./FundedDeals.css";
import { formatLocalDate } from "../../utils";

const FundedDeals = () => {
  const [openModal, setOpenModal] = useState(false);
  const [deals, setDeals] = useState([]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleAddDeal = (newDeal) => {
    setDeals((prevDeals) => [...prevDeals, newDeal]);
    setOpenModal(false);
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const parseLocalDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const filteredDeals = deals.filter((deal) => {
    const dealDate = parseLocalDate(deal.date);
    return (
      dealDate.getFullYear() === selectedYear &&
      dealDate.getMonth() === selectedMonth
    );
  });

  const filteredIncome = filteredDeals.reduce((sum, d) => sum + d.income, 0);

  return (
    <Box className="funded-deals-container">
      <Box className="funded-deals-header">
        <Typography variant="h4">Funded Deals</Typography>
        <Button variant="contained" onClick={handleOpenModal}>
          Add New Deal
        </Button>
      </Box>

      <Box className="deal-filters" sx={{ display: "flex", gap: 2, mb: 2 }}>
        <FormControl>
          <InputLabel id="month-label">Month</InputLabel>
          <Select
            labelId="month-label"
            value={selectedMonth}
            label="Month"
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            sx={{ minWidth: 120 }}
          >
            {months.map((month, index) => (
              <MenuItem key={month} value={index}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="year-label">Year</InputLabel>
          <Select
            labelId="year-label"
            value={selectedYear}
            label="Year"
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            sx={{ minWidth: 100 }}
          >
            {[...Array(5)].map((_, i) => {
              const year = currentYear - i;
              return (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>

      <Box className="funded-deals-summary">
        <Card className="deal-summary-card">
          <CardContent>
            <Box className="deal-summary-content">
              <AssignmentTurnedInIcon className="deal-summary-icon" />
              <Box>
                <Typography variant="subtitle2">
                  {months[selectedMonth]} {selectedYear} Deals
                </Typography>
                <Typography variant="h6">{filteredDeals.length}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card className="deal-summary-card">
          <CardContent>
            <Box className="deal-summary-content">
              <TrendingUpIcon className="deal-summary-icon" />
              <Box>
                <Typography variant="subtitle2">
                  {months[selectedMonth]} {selectedYear} Income
                </Typography>
                <Typography variant="h6">
                  ${filteredIncome.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Paper className="funded-deals-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Customer Name</strong>
              </TableCell>
              <TableCell>
                <strong>Date</strong>
              </TableCell>
              <TableCell>
                <strong>Total Income</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deals
              .filter((deal) => {
                const [year, month] = deal.date.split("-").map(Number);
                return year === selectedYear && month - 1 === selectedMonth;
              })
              .map((deal, idx) => (
                <TableRow key={idx}>
                  <TableCell>{deal.customer}</TableCell>
                  <TableCell>{formatLocalDate(deal.date)}</TableCell>
                  <TableCell>${deal.income.toLocaleString()}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Paper>
      <AddDealModal
        open={openModal}
        onClose={handleCloseModal}
        onAddDeal={handleAddDeal}
      />
    </Box>
  );
};

export default FundedDeals;
