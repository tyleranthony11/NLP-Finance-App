import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddDealModal from "../../components/AddDealModal";
import StatCard from "../../components/StatCard";
import HandshakeIcon from "@mui/icons-material/Handshake";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
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

  const [deals, setDeals] = useState([]);

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

    fetchDeals();
  }, []);

  const parseDate = (dateStr) => dayjs(dateStr);

  const filteredDeals = deals.filter((deal) => {
    const dealDate = parseDate(deal.dealDate);
    return (
      dealDate.year() === selectedDate.year() &&
      dealDate.month() === selectedDate.month()
    );
  });

  const rows = filteredDeals.map((deal) => {
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
      ...deal,
      id: deal.id,
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
      field: "customerName",
      headerName: "Customer Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: true,
    },
    {
      field: "dealDate",
      headerName: "Date",
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: true,
      renderCell: (params) => dayjs(params.value).format("MMMM D, YYYY"),
    },
    { field: "dealerName", headerName: "Dealer" },
    { field: "lenderName", headerName: "Lender" },
    { field: "employeeName", headerName: "Employee" },
    {
      field: "brokerageFee",
      headerName: "Brokerage Fee",
      renderCell: currencyRender,
      editable: true,
    },
    {
      field: "lifeInsurance",
      headerName: "Life Ins.",
      renderCell: currencyRender,
      editable: true,
    },
    {
      field: "ahInsurance",
      headerName: "A/H Ins.",
      renderCell: currencyRender,
      editable: true,
    },
    {
      field: "ciInsurance",
      headerName: "CI Ins.",
      renderCell: currencyRender,
      editable: true,
    },
    {
      field: "gapInsurance",
      headerName: "GAP",
      renderCell: currencyRender,
      editable: true,
    },
    {
      field: "warranty",
      headerName: "Warranty",
      renderCell: currencyRender,
      editable: true,
    },
    {
      field: "bankReserve",
      headerName: "Bank Reserve",
      renderCell: currencyRender,
      editable: true,
    },
    {
      field: "dealerReserve",
      headerName: "Dealer Reserve",
      renderCell: currencyRender,
      editable: true,
    },
    {
      field: "otherFI",
      headerName: "Other F&I",
      renderCell: currencyRender,
      editable: true,
    },
    {
      field: "nlpReserve",
      headerName: "NLP Reserve",
      renderCell: currencyRender,
      editable: true,
    },
    {
      field: "income",
      headerName: "Total Income",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: currencyRender,
      editable: false,
    },
    {
      field: "actions",
      headerName: "Delete",
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <IconButton color="grey" onClick={() => handleDelete(params.row.id)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];
  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/funded-deals/${id}`,
        { method: "DELETE" },
      );

      const json = await res.json();

      if (!json.success) {
        console.error("Delete funded deal failed:", json.message || json);
        alert(json.message || "Failed to delete funded deal");
        return;
      }

      setDeals((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Delete funded deal failed:", err);
      alert("Failed to delete funded deal");
    }
  };

  const handleAddDeal = async (newDeal) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/funded-deals`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newDeal),
        },
      );

      const json = await res.json();

      if (!json.success) {
        console.error("Create funded deal failed:", json.message || json);
        alert(json.message || "Failed to create funded deal");
        return;
      }

      setDeals((prev) => [...prev, json.data]);
    } catch (err) {
      console.error("Create funded deal failed:", err);
      alert("Failed to create funded deal");
    }
  };

  const handleRowUpdate = async (newRow, oldRow) => {
    const calculateIncome = (row) => {
      return (
        Number(row.brokerageFee || 0) +
        Number(row.lifeInsurance || 0) +
        Number(row.ahInsurance || 0) +
        Number(row.ciInsurance || 0) +
        Number(row.gapInsurance || 0) +
        Number(row.warranty || 0) +
        Number(row.bankReserve || 0) +
        Number(row.dealerReserve || 0) -
        Number(row.nlpReserve || 0) +
        Number(row.otherFI || 0)
      );
    };

    const updatedRow = {
      ...newRow,
      income: calculateIncome(newRow),
    };

    const changes = {};
    Object.keys(updatedRow).forEach((key) => {
      if (key === "income") return;
      if (updatedRow[key] !== oldRow[key]) {
        changes[key] = updatedRow[key];
      }
    });

    if (Object.keys(changes).length === 0) {
      return oldRow;
    }

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/funded-deals/${oldRow.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      },
    );

    const json = await res.json();

    if (!json.success) {
      throw new Error(json.message || "Update failed");
    }

    const savedRow = json.data;

    setDeals((prev) => prev.map((d) => (d.id === savedRow.id ? savedRow : d)));

    return savedRow;
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
        <StatCard
          icon={<PriceCheckIcon sx={styles.icon} />}
          label="Average Income/Deal"
          value={`$${(totalMonthlyIncome / (rows.length || 1)).toLocaleString(
            undefined,
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            },
          )}`}
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
          showToolbar
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableRowSelectionOnClick
          processRowUpdate={handleRowUpdate}
          onProcessRowUpdateError={(err) => {
            console.error(err);
            alert(err.message || "Update failed");
          }}
          initialState={{
            columns: {
              columnVisibilityModel: {
                dealerName: false,
                lenderName: false,
                employeeName: false,
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
