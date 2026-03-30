import React, { useEffect, useState } from "react";
import { authFetch } from "../../auth/authFetch.js";
import { msalInstance } from "../../auth/msalConfig";
import { Box, Button, Typography, Modal } from "@mui/material";
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
  container: {
    p: 3,
    pb: 0,
    minHeight: "100%",
    bgcolor: "#18191A",
    color: "#F5F5F6",
  },
  filterRow: {
    display: "flex",
    gap: 2,
    mb: 2,
    alignItems: "center",
    p: 2,
    borderRadius: 3,
    border: "1px solid #2B2B2F",
    bgcolor: "#1F2023",
  },
  addButton: {
    bgcolor: "#EB001B",
    textTransform: "none",
    fontWeight: 700,
    borderRadius: 2,
    px: 2.5,
    "&:hover": { bgcolor: "#C40018" },
  },
  dataGridWrapper: { overflowX: "auto" },
  statCards: {
    display: "flex",
    gap: 2,
    mb: 2,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "stretch",
    flexWrap: { xs: "wrap", lg: "nowrap" },
  },
  icon: { fontSize: 34, color: "#EB001B" },
};

const FundedDeals = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [modalOpen, setModalOpen] = useState(false);
  const [deals, setDeals] = useState([]);
  const [importOpen, setImportOpen] = useState(false);
  const [importFile, setImportFile] = useState(null);

  const hasSignedInAccount = () => msalInstance.getAllAccounts().length > 0;

  const splitCsvLine = (line) =>
    line
      .split(/,(?=(?:(?:[^\"]*\"){2})*[^\"]*$)/)
      .map((cell) => cell.trim().replace(/^"|"$/g, ""));

  const parseCsvRows = (text) => {
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length < 2) return [];

    const headers = splitCsvLine(lines[0]);
    const requiredHeaders = [
      "customerName",
      "dealDate",
      "dealerName",
      "lenderName",
      "employeeName",
    ];

    const missing = requiredHeaders.filter((h) => !headers.includes(h));
    if (missing.length > 0) {
      throw new Error(`Missing required column(s): ${missing.join(", ")}`);
    }

    return lines.slice(1).map((line) => {
      const values = splitCsvLine(line);
      return headers.reduce((acc, header, index) => {
        acc[header] = values[index] ?? "";
        return acc;
      }, {});
    });
  };

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await authFetch(
          `${import.meta.env.VITE_API_URL}/api/funded-deals`,
        );
        if (!res) return;

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

  const rows = filteredDeals.map((deal) => ({
    ...deal,
    id: deal.id,
    income: Number(deal.income || 0),
  }));

  const totalMonthlyIncome = rows.reduce(
    (sum, deal) => sum + Number(deal.income || 0),
    0,
  );

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

  const handleDelete = async (id) => {
    try {
      const res = await authFetch(
        `${import.meta.env.VITE_API_URL}/api/funded-deals/${id}`,
        { method: "DELETE" },
      );
      if (!res) return;

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

  const handleAddDeal = async (newDeal) => {
    try {
      const res = await authFetch(
        `${import.meta.env.VITE_API_URL}/api/funded-deals`,
        {
          method: "POST",
          body: JSON.stringify(newDeal),
        },
      );
      if (!res) return;

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
    const calculateIncome = (row) =>
      Number(row.brokerageFee || 0) +
      Number(row.lifeInsurance || 0) +
      Number(row.ahInsurance || 0) +
      Number(row.ciInsurance || 0) +
      Number(row.gapInsurance || 0) +
      Number(row.warranty || 0) +
      Number(row.bankReserve || 0) +
      Number(row.dealerReserve || 0) -
      Number(row.nlpReserve || 0) +
      Number(row.otherFI || 0);

    const updatedRow = { ...newRow, income: calculateIncome(newRow) };

    const changes = {};
    Object.keys(updatedRow).forEach((key) => {
      if (key === "income") return;
      if (updatedRow[key] !== oldRow[key]) changes[key] = updatedRow[key];
    });

    if (Object.keys(changes).length === 0) return oldRow;

    const res = await authFetch(
      `${import.meta.env.VITE_API_URL}/api/funded-deals/${oldRow.id}`,
      {
        method: "PUT",
        body: JSON.stringify(changes),
      },
    );
    if (!res) return oldRow;

    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Update failed");

    const savedRow = json.data;
    setDeals((prev) => prev.map((d) => (d.id === savedRow.id ? savedRow : d)));
    return savedRow;
  };

  const handleImportDeals = async () => {
    if (!importFile) return;
    if (!hasSignedInAccount()) {
      alert("Please sign in to import funded deals.");
      return;
    }

    try {
      const csvText = await importFile.text();
      const csvRows = parseCsvRows(csvText);
      if (csvRows.length === 0) {
        alert("CSV has no data rows to import.");
        return;
      }

      const toNumber = (value) => parseFloat(value || 0) || 0;
      const created = [];

      for (const row of csvRows) {
        const payload = {
          customerName: row.customerName || "",
          dealDate: row.dealDate || "",
          dealerName: row.dealerName || "",
          lenderName: row.lenderName || "",
          employeeName: row.employeeName || "",
          brokerageFee: toNumber(row.brokerageFee),
          lifeInsurance: toNumber(row.lifeInsurance),
          ahInsurance: toNumber(row.ahInsurance),
          ciInsurance: toNumber(row.ciInsurance),
          bankReserve: toNumber(row.bankReserve),
          dealerReserve: toNumber(row.dealerReserve),
          nlpReserve: toNumber(row.nlpReserve),
          warranty: toNumber(row.warranty),
          gapInsurance: toNumber(row.gapInsurance),
          otherFI: toNumber(row.otherFI),
        };

        if (
          !payload.customerName.trim() ||
          !payload.dealDate.trim() ||
          !payload.dealerName.trim() ||
          !payload.lenderName.trim() ||
          !payload.employeeName.trim()
        ) {
          continue;
        }

        const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/funded-deals`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if (!res) continue;

        const json = await res.json().catch(() => null);
        if (!res.ok || !json?.success) {
          const errMessage = json?.message || "Import failed on one or more rows";
          throw new Error(errMessage);
        }

        created.push(json.data);
      }

      if (created.length === 0) {
        alert("No valid rows were imported. Please check required fields.");
        return;
      }

      setDeals((prev) => [...created, ...prev]);
      setImportOpen(false);
      setImportFile(null);
    } catch (err) {
      console.error("FUNDED DEALS IMPORT ERROR:", err);
      alert("Import failed");
    }
  };

  return (
    <Box sx={styles.container}>
      <Box
        sx={{
          mb: 2,
          p: 2,
          borderRadius: 3,
          border: "1px solid #2B2B2F",
          bgcolor: "#1F2023",
        }}
      >
        <Typography variant="h4" sx={{ mb: 0.25, fontWeight: 700 }}>
          Funded Deals
        </Typography>
        <Typography variant="body2" sx={{ color: "#A5A7AC" }}>
          Monitor monthly deal performance and update deal-level values.
        </Typography>
      </Box>

      <Box sx={styles.statCards}>
        <Box sx={{ flex: 1, minWidth: 280, "& .MuiCard-root": { maxWidth: "none", width: "100%" } }}>
          <StatCard
            icon={<HandshakeIcon sx={styles.icon} />}
            label="Number of Deals"
            value={rows.length}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 280, "& .MuiCard-root": { maxWidth: "none", width: "100%" } }}>
          <StatCard
            icon={<MonetizationOnIcon sx={styles.icon} />}
            label="Total Income"
            value={`$${totalMonthlyIncome.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 280, "& .MuiCard-root": { maxWidth: "none", width: "100%" } }}>
          <StatCard
            icon={<PriceCheckIcon sx={styles.icon} />}
            label="Average Income/Deal"
            value={`$${(totalMonthlyIncome / (rows.length || 1)).toLocaleString(
              undefined,
              { minimumFractionDigits: 2, maximumFractionDigits: 2 },
            )}`}
          />
        </Box>
      </Box>

      <Box sx={styles.filterRow}>
        <Box
          sx={{
            "& .MuiPickersInputBase-root, & .MuiPickersOutlinedInput-root": {
              color: "#D1D5DB !important",
            },
            "& .MuiPickersSectionList-root, & .MuiPickersSectionList-section, & .MuiPickersSectionList-sectionContent":
              {
                color: "#D1D5DB !important",
                WebkitTextFillColor: "#D1D5DB !important",
                opacity: "1 !important",
              },
            "& .MuiFormLabel-root, & .MuiInputLabel-root": {
              color: "#EB001B !important",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#EB001B !important",
            },
          }}
        >
          <MonthPicker value={selectedDate} onChange={setSelectedDate} />
        </Box>
        <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            onClick={() => setModalOpen(true)}
            sx={styles.addButton}
          >
            Add Deal
          </Button>
          <Button
            variant="contained"
          onClick={() => {
            if (!hasSignedInAccount()) {
              alert("Please sign in to import funded deals.");
              return;
            }
            setImportOpen(true);
          }}
            sx={styles.addButton}
          >
            Import CSV
          </Button>
        </Box>
      </Box>

      <Box sx={styles.dataGridWrapper}>
        <DataGrid
          showToolbar
          rows={rows}
          columns={columns}
          localeText={{
            noRowsLabel: "No deals yet",
          }}
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
          sx={{
            border: "1px solid #2B2B2F",
            borderRadius: 3,
            color: "#E5E7EB",
            bgcolor: "#18191A",
            "& .MuiDataGrid-toolbarContainer": {
              px: 1.5,
              py: 1,
              borderBottom: "1px solid #2B2B2F",
              background: "#1F2023",
              color: "#EB001B !important",
            },
            "& .MuiDataGrid-toolbarContainer *": {
              color: "#EB001B !important",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-root, & .MuiDataGrid-toolbarContainer .MuiIconButton-root": {
              color: "#EB001B !important",
            },
            "& .MuiDataGrid-toolbarContainer .MuiSvgIcon-root": {
              color: "#EB001B !important",
              fill: "#EB001B !important",
              opacity: "1 !important",
            },
            "& .MuiDataGrid-toolbarContainer .MuiDataGrid-toolbarQuickFilter .MuiInputBase-root, & .MuiDataGrid-toolbarContainer .MuiDataGrid-toolbarQuickFilter .MuiInputBase-input": {
              color: "#EB001B !important",
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: "1px solid #2B2B2F",
              background: "#212327",
              color: "#F5F5F5",
              fontWeight: 700,
            },
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "#212327",
              color: "#F5F5F5",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              color: "#F5F5F5",
              fontWeight: 700,
            },
            "& .MuiDataGrid-sortIcon, & .MuiDataGrid-menuIconButton, & .MuiDataGrid-columnHeader .MuiSvgIcon-root": {
              color: "#F5F5F5",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #25272C",
              color: "#F5F5F6",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#23262B",
              cursor: "pointer",
            },
            "& .MuiDataGrid-overlay, & .MuiDataGrid-overlayWrapper": {
              backgroundColor: "#121316",
              color: "#C7CAD1",
            },
            "& .MuiDataGrid-row.Mui-selected": {
              backgroundColor: "rgba(235,0,27,0.16) !important",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid #2B2B2F",
              background: "#1F2023",
            },
            "& .MuiTablePagination-root, & .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows, & .MuiTablePagination-select, & .MuiInputBase-root, & .MuiSelect-select": {
              color: "#F5F5F5",
            },
            "& .MuiTablePagination-actions .MuiIconButton-root, & .MuiTablePagination-actions .MuiSvgIcon-root": {
              color: "#F5F5F5",
            },
          }}
        />
      </Box>

      <AddDealModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddDeal}
      />

      <Modal open={importOpen} onClose={() => setImportOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "92vw", sm: 460 },
            bgcolor: "#1F2023",
            color: "#F5F5F6",
            border: "1px solid #33353A",
            boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
            p: 4,
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
            Import Funded Deals CSV
          </Typography>
          <Typography variant="body2" sx={{ color: "#A5A7AC", mb: 1 }}>
            Choose your CSV file to import funded deals.
          </Typography>

          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{
              mt: 2,
              borderColor: "#4B5563",
              color: "#D1D5DB",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                borderColor: "#EB001B",
                color: "#F5F5F6",
                backgroundColor: "rgba(235,0,27,0.12)",
              },
            }}
          >
            Select CSV File
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
            />
          </Button>

          {importFile && (
            <Typography sx={{ mt: 1, color: "#C7CAD1" }} variant="body2">
              Selected: {importFile.name}
            </Typography>
          )}

          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="outlined"
              onClick={() => setImportOpen(false)}
              sx={{
                borderColor: "#4B5563",
                color: "#D1D5DB",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  borderColor: "#EB001B",
                  color: "#F5F5F6",
                  backgroundColor: "rgba(235,0,27,0.12)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={!importFile}
              onClick={handleImportDeals}
              sx={{
                bgcolor: "#EB001B",
                textTransform: "none",
                fontWeight: 700,
                "&:hover": { bgcolor: "#C40018" },
                "&.Mui-disabled": {
                  bgcolor: "#3A3B40",
                  color: "#8F939C",
                },
              }}
            >
              Import
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default FundedDeals;
