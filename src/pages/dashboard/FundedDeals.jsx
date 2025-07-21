import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddDealModal from "../../components/AddDealModal";
import StatCard from "../../components/StatCard";
import HandshakeIcon from "@mui/icons-material/Handshake";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import MonthPicker from "../../components/MonthPicker";
import dayjs from "dayjs";
import { NumericFormat } from "react-number-format";

const styles = {
  container: { p: 3 },
  filterRow: { display: "flex", gap: 2, mb: 2, alignItems: "center" },
  addButton: { ml: "auto" },
  dataGridWrapper: { overflowX: "auto" },
  statCards: {
    display: "flex",
    justifyContent: "center",
    gap: 4,
    mb: 4,
    flexWrap: "wrap",
  },
  icon: { fontSize: 32 },
};

const FundedDeals = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [modalOpen, setModalOpen] = useState(false);

  const [deals, setDeals] = useState(() => {
    const saved = localStorage.getItem("fundedDeals");
    return saved ? JSON.parse(saved) : [];
  });

  const parseLocalDate = (dateStr) => dayjs(dateStr);
  const filteredDeals = deals.filter((deal) => {
    const dealDate = parseLocalDate(deal.date);
    return (
      dealDate.year() === selectedDate.year() &&
      dealDate.month() === selectedDate.month()
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

  const totalMonthlyIncome = rows.reduce((sum, deal) => sum + deal.income, 0);

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
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => dayjs(params.value).format("MMMM D, YYYY"),
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
      renderCell: currencyRender,
    },
  ];

  const handleAddDeal = (newDeal) => {
    const updatedDeals = [...deals, newDeal];
    setDeals(updatedDeals);
    localStorage.setItem("fundedDeals", JSON.stringify(updatedDeals));
  };

  return (
    <Box sx={styles.container}>
      <Typography variant="h4" mb={2} fontWeight={550}>
        Funded Deals
      </Typography>

      <Box sx={styles.statCards}>
        <StatCard
          icon={<HandshakeIcon sx={styles.icon} />}
          label="Number of Deals"
          value={rows.length}
        />
        <StatCard
          icon={<MonetizationOnIcon sx={styles.icon} />}
          label="Total Income"
          value={`$${totalMonthlyIncome.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
        />
      </Box>

      <Box sx={styles.filterRow}>
        <MonthPicker value={selectedDate} onChange={setSelectedDate} />
        <Button
          variant="contained"
          onClick={() => setModalOpen(true)}
          sx={styles.addButton}
        >
          Add Deal
        </Button>
      </Box>

      <Box sx={styles.dataGridWrapper}>
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
