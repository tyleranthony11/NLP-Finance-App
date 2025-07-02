import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddDealModal from "../../components/AddDealModal";
import dayjs from "dayjs";
import { NumericFormat } from "react-number-format";

const containerStyle = { p: 3 };
const filterRowStyle = { display: "flex", gap: 2, mb: 2 };
const addButtonStyle = { ml: "auto" };
const dataGridWrapperStyle = { display: "inline-block", minWidth: 1000 };

const FundedDeals = () => {
  const now = new dayjs();
  const currentMonth = now.month();
  const currentYear = now.year();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [deals, setDeals] = useState([
    {
      customer: "John Doe",
      date: "2025-06-15",
      dealer: "Big Wheels Motors",
      lender: "ABC Bank",
      brokerageFee: 500,
      lifeInsurance: 300,
      ahInsurance: 200,
      ciInsurance: 150,
      gapInsurance: 250,
      warranty: 400,
      bankReserve: 100,
      dealerReserve: 75,
      nlpReserve: 50,
      otherFI: 80,
    },
  ]);
  const [modalOpen, setModalOpen] = useState(false);

  const parseLocalDate = (dateStr) => dayjs(dateStr);

  const filteredDeals = deals.filter((deal) => {
    const dealDate = parseLocalDate(deal.date);
    return (
      dealDate.year() === selectedYear && dealDate.month() === selectedMonth
    );
  });

  const rows = filteredDeals.map((deal, index) => {
    const income =
      Number(deal.brokerageFee || 0) +
      Number(deal.lifeInsurance || 0) +
      Number(deal.ahInsurance || 0) +
      Number(deal.ciInsurance || 0) +
      Number(deal.gapInsurance || 0) +
      Number(deal.warranty || 0) +
      Number(deal.bankReserve || 0) +
      Number(deal.dealerReserve || 0) -
      Number(deal.nlpReserve || 0) +
      Number(deal.otherFI || 0);

    return {
      id: index,
      ...deal,
      income,
    };
  });

  const currencyRender = (params) => (
    <NumericFormat
      value={params.value}
      displayType="text"
      thousandSeparator
      prefix="$"
      decimalScale={2}
      fixedDecimalScale
    />
  );
  const columns = [
    {
      field: "customer",
      headerName: "Customer Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
      maxWidth: 400,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      align: "center",
      headerAlign: "center",
      maxWidth: 400,
    },
    { field: "dealer", headerName: "Dealer" },
    { field: "lender", headerName: "Lender" },
    {
      field: "brokerageFee",
      headerName: "Brokerage Fee",
      renderCell: currencyRender,
    },
    {
      field: "lifeInsurance",
      headerName: "Life Ins.",
      renderCell: currencyRender,
    },
    {
      field: "ahInsurance",
      headerName: "A/H Ins.",
      renderCell: currencyRender,
    },
    { field: "ciInsurance", headerName: "CI Ins.", renderCell: currencyRender },
    { field: "gapInsurance", headerName: "GAP", renderCell: currencyRender },
    { field: "warranty", headerName: "Warranty", renderCell: currencyRender },
    {
      field: "bankReserve",
      headerName: "Bank Reserve",
      renderCell: currencyRender,
    },
    {
      field: "dealerReserve",
      headerName: "Dealer Reserve",
      renderCell: currencyRender,
    },
    { field: "otherFI", headerName: "Other F&I", renderCell: currencyRender },
    {
      field: "nlpReserve",
      headerName: "NLP Reserve",
      renderCell: currencyRender,
    },
    {
      field: "income",
      headerName: "Total Income",
      flex: 1,
      align: "center",
      headerAlign: "center",
      maxWidth: 400,
      renderCell: currencyRender,
    },
  ];

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

  const handleAddDeal = (newDeal) => {
    setDeals((prev) => [...prev, newDeal]);
  };

  return (
    <Box sx={containerStyle}>
      <Typography variant="h4" mb={2}>
        Funded Deals
      </Typography>

      <Box sx={filterRowStyle}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="month-label">Month</InputLabel>
          <Select
            labelId="month-label"
            value={selectedMonth}
            label="Month"
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {months.map((month, index) => (
              <MenuItem key={month} value={index}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 100 }}>
          <InputLabel id="year-label">Year</InputLabel>
          <Select
            labelId="year-label"
            value={selectedYear}
            label="Year"
            onChange={(e) => setSelectedYear(Number(e.target.value))}
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

        <Button
          variant="contained"
          onClick={() => setModalOpen(true)}
          sx={addButtonStyle}
        >
          Add Deal
        </Button>
      </Box>

      <Box sx={dataGridWrapperStyle}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableRowSelectionOnClick
          initialState={{
            columns: {
              columnVisibilityModel: {
                dealer: false,
                lender: false,
                brokerageFee: false,
                lifeInsurance: false,
                ahInsurance: false,
                ciInsurance: false,
                gapInsurance: false,
                warranty: false,
                bankReserve: false,
                dealerReserve: false,
                nlpReserve: false,
                otherFI: false,
              },
            },
          }}
        />
      </Box>

      <AddDealModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddDeal}
      />
    </Box>
  );
};

export default FundedDeals;
