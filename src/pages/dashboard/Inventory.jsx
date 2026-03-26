import React, { useState, useEffect } from "react";
import { authFetch } from "../../auth/authFetch.js";
import {
  Box,
  Typography,
  Avatar,
  Modal,
  Button,
  TextField,
  MenuItem,
  Chip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { NumericFormat } from "react-number-format";
import ImportInventoryModal from "../../components/ImportInventoryModal";
import { capitalizeFirstLetter } from "../../utils.js";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

const Inventory = () => {
  const [listings, setListings] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [importOpen, setImportOpen] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importDealership, setImportDealership] = useState("");
  const [rowSelection, setRowSelection] = useState({
    type: "include",
    ids: new Set(),
  });

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await authFetch(
          `${import.meta.env.VITE_API_URL}/api/marketplace/admin`,
        );
        if (!res) return;

        const json = await res.json();

        if (!json.success) {
          console.error("Failed to load marketplace listings", json);
          return;
        }

        setListings(json.data);
      } catch (err) {
        console.error("Failed to load marketplace listings", err);
      }
    };

    fetchListings();
  }, []);

  const handleRowClick = (params) => {
    setSelectedListing(params.row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedListing(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedListing((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    if (!selectedListing) return;

    try {
      const payload = {
        title: selectedListing.title ?? null,
        condition: selectedListing.condition ?? null,
        category: selectedListing.category ?? null,
        subcategory: selectedListing.subcategory ?? null,
        year: selectedListing.year ?? null,
        make: selectedListing.make ?? null,
        model: selectedListing.model ?? null,
        price: selectedListing.price ?? null,
        description: selectedListing.description ?? null,
        interestRate: selectedListing.interestRate ?? null,
        term: selectedListing.term ?? null,
        dealership: selectedListing.dealership ?? null,
        status: selectedListing.status ?? null,
      };

      const odoValue = selectedListing.odometerValue;
      const odoUnit = selectedListing.odometerUnit;

      const hasValue =
        odoValue !== null && odoValue !== undefined && odoValue !== "";
      const hasUnit =
        odoUnit !== null && odoUnit !== undefined && odoUnit !== "";

      if (hasValue && hasUnit) {
        payload.odometerValue = Number(odoValue);
        payload.odometerUnit = odoUnit;
      } else if (!hasValue && !hasUnit) {
        payload.odometerValue = null;
        payload.odometerUnit = null;
      }

      const res = await authFetch(
        `${import.meta.env.VITE_API_URL}/api/marketplace/${selectedListing.id}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        },
      );
      if (!res) return;

      const json = await res.json();

      if (!json.success) {
        console.error("Update listing failed:", json);
        alert(json.message || "Failed to update listing");
        return;
      }

      const saved = json.data;
      setListings((prev) => prev.map((l) => (l.id === saved.id ? saved : l)));
      handleClose();
    } catch (err) {
      console.error("Update listing failed:", err);
      alert("Failed to update listing");
    }
  };

  const handleMarkAsSold = async () => {
    if (!selectedListing) return;

    try {
      const res = await authFetch(
        `${import.meta.env.VITE_API_URL}/api/marketplace/${selectedListing.id}`,
        {
          method: "PUT",
          body: JSON.stringify({ status: "sold" }),
        },
      );
      if (!res) return;

      const json = await res.json();

      if (!json.success) {
        console.error("Mark as sold failed:", json);
        alert(json.message || "Failed to mark as sold");
        return;
      }

      const saved = json.data;
      setListings((prev) => prev.filter((l) => l.id !== saved.id));
      handleClose();
    } catch (err) {
      console.error("Mark as sold failed:", err);
      alert("Failed to mark as sold");
    }
  };

  const handleImport = async () => {
    if (!importFile || !importDealership) return;

    try {
      const fd = new FormData();
      fd.append("dealership", importDealership);
      fd.append("file", importFile);

      const url = `${import.meta.env.VITE_API_URL}/api/marketplace/import`;

      const res = await authFetch(url, {
        method: "POST",
        body: fd,
      });
      if (!res) return;

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.success) {
        console.error("IMPORT FAILED:", json);
        alert(json?.message || `Import failed (${res.status})`);
        return;
      }

      const created = json.data || [];
      setListings((prev) => [...created, ...prev]);

      setImportOpen(false);
      setImportFile(null);
      setImportDealership("");
    } catch (err) {
      console.error("IMPORT ERROR:", err);
      alert("Import failed");
    }
  };

  const handleDeleteSelected = async () => {
    const selectedIds = Array.from(rowSelection.ids);

    if (selectedIds.length === 0) return;

    const confirmed = window.confirm(
      `Delete ${selectedIds.length} selected unit(s)?`,
    );
    if (!confirmed) return;

    try {
      await Promise.all(
        selectedIds.map((id) =>
          authFetch(`${import.meta.env.VITE_API_URL}/api/marketplace/${id}`, {
            method: "DELETE",
          }),
        ),
      );

      setListings((prev) =>
        prev.filter((listing) => !selectedIds.includes(listing.id)),
      );

      setRowSelection({
        type: "include",
        ids: new Set(),
      });
    } catch (err) {
      console.error("Failed to delete selected listings:", err);
      alert("Failed to delete selected listings");
    }
  };

  const columns = [
    {
      field: "photo",
      headerName: "Photo",
      flex: 0.25,
      minWidth: 80,
      sortable: false,
      filterable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Avatar
          variant="rounded"
          src={params.value}
          alt={`${params.row.make} ${params.row.model}`}
          sx={{ width: 64, height: 40 }}
        />
      ),
    },
    {
      field: "category",
      headerName: "Category",
      flex: 0.5,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => capitalizeFirstLetter(params.value),
    },
    {
      field: "subcategory",
      headerName: "Subcategory",
      flex: 0.9,
      minWidth: 140,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "condition",
      headerName: "Condition",
      flex: 0.6,
      minWidth: 110,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        params.value ? capitalizeFirstLetter(params.value) : "",
    },
    {
      field: "title",
      headerName: "Title",
      flex: 1.6,
      minWidth: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "year",
      headerName: "Year",
      type: Number,
      flex: 0.5,
      minWidth: 90,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "make",
      headerName: "Make",
      flex: 1,
      minWidth: 110,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "model",
      headerName: "Model",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "price",
      headerName: "Price",
      type: Number,
      flex: 0.6,
      minWidth: 110,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <NumericFormat
          value={params.value}
          displayType="text"
          thousandSeparator
          prefix="$"
        />
      ),
    },
    {
      field: "odometer",
      headerName: "Odometer",
      flex: 0.8,
      minWidth: 130,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => {
        const v = params?.row?.odometerValue;
        const u = params?.row?.odometerUnit;
        if (v === null || v === undefined || v === "" || !u) return "";
        return `${Number(v).toLocaleString()} ${u}`;
      },
    },
    {
      field: "dealership",
      headerName: "Dealership",
      flex: 1,
      minWidth: 160,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "interestRate",
      headerName: "Interest Rate",
      flex: 0.6,
      minWidth: 160,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "term",
      headerName: "Term",
      flex: 0.6,
      minWidth: 160,
      headerAlign: "center",
      align: "center",
    },
  ];

  const rows = listings
    .filter((listing) => listing.status !== "sold")
    .map((listing) => ({
      id: listing.id,
      photo: listing.photos?.[0] || "",
      category: listing.category || "",
      subcategory: listing.subcategory || "",
      title: listing.title || "",
      condition: listing.condition || "",
      year: Number(listing.year) || 0,
      make: listing.make || "",
      model: listing.model || "",
      odometerValue: listing.odometerValue ?? "",
      odometerUnit: listing.odometerUnit ?? "",
      price: Number(listing.price) || 0,
      description: listing.description || "",
      name: listing.name || "",
      email: listing.email || "",
      phone: listing.phone || "",
      photos: listing.photos || [],
      interestRate: listing.interestRate ?? "",
      term: listing.term ?? "",
      dealership: listing.dealership || "",
      status: listing.status || "active",
    }));

  return (
    <Box
      sx={{
        height: "100%",
        minHeight: 0,
        width: "100%",
        p: 3,
        pb: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        overflow: "hidden",
        bgcolor: "#18191A",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 0,
          p: 2,
          borderRadius: 3,
          border: "1px solid #2B2B2F",
          bgcolor: "#1F2023",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ mb: 0.25, fontWeight: 700, color: "#F8F8F9" }}
          >
            Inventory
          </Typography>
          <Typography variant="body2" sx={{ color: "#A5A7AC" }}>
            Manage active listings, pricing, and status updates.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {rowSelection.ids.size > 0 && (
            <Chip
              label={`${rowSelection.ids.size} selected`}
              size="small"
              sx={{
                bgcolor: "#2B2B2F",
                color: "#DADCE0",
                border: "1px solid #3A3B40",
              }}
            />
          )}
          <Button
            variant="contained"
            onClick={() => setImportOpen(true)}
            sx={{
              bgcolor: "#EB001B",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: 2,
              px: 2,
              transition: "all 0.2s ease",
              boxShadow: "0 8px 18px rgba(235, 0, 27, 0.22)",
              "&:hover": {
                bgcolor: "#C40018",
                transform: "translateY(-1px)",
                boxShadow: "0 12px 24px rgba(235, 0, 27, 0.28)",
              },
              "&:active": {
                transform: "translateY(0)",
                boxShadow: "0 4px 12px rgba(235, 0, 27, 0.2)",
              },
            }}
          >
            Import CSV
          </Button>

          <Tooltip title="Delete Selected">
            <span>
              <IconButton
                sx={{
                  color: rowSelection.ids.size < 1 ? "#9CA3AF" : "#FFFFFF",
                  border: "1px solid #3A3B40",
                  bgcolor: rowSelection.ids.size < 1 ? "#24262A" : "#EB001B",
                  transition: "all 0.2s ease",
                  boxShadow:
                    rowSelection.ids.size < 1
                      ? "none"
                      : "0 8px 18px rgba(235, 0, 27, 0.24)",
                  "&:hover": {
                    bgcolor: rowSelection.ids.size < 1 ? "#2D3136" : "#C40018",
                    transform: rowSelection.ids.size < 1 ? "none" : "translateY(-1px)",
                    boxShadow:
                      rowSelection.ids.size < 1
                        ? "none"
                        : "0 12px 24px rgba(235, 0, 27, 0.3)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                  },
                  "& .MuiSvgIcon-root": {
                    color: rowSelection.ids.size < 1 ? "#9CA3AF" : "#FFFFFF",
                  },
                }}
                onClick={handleDeleteSelected}
                disabled={rowSelection.ids.size < 1}
              >
                <DeleteIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          borderRadius: 3,
          border: "1px solid #2B2B2F",
          bgcolor: "#18191A",
          overflow: "hidden",
        }}
      >
        <DataGrid
          showToolbar
          rows={rows}
          columns={columns}
          localeText={{
            noRowsLabel: "No listings yet",
          }}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          checkboxSelection
          disableRowSelectionOnClick
          rowSelectionModel={rowSelection}
          onRowSelectionModelChange={(newSelection) => {
            setRowSelection(newSelection);
          }}
          onRowClick={(params, event) => {
            if (event.target?.closest?.(".MuiDataGrid-cellCheckbox")) return;
            handleRowClick(params);
          }}
          initialState={{
            columns: {
              columnVisibilityModel: {
                photo: true,
                title: true,
                year: true,
                make: true,
                model: true,
                price: true,
                odometer: true,
                dealership: true,
                category: false,
                subcategory: false,
                condition: false,
              },
            },
          }}
          sx={{
            border: "none",
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
            "& .MuiDataGrid-toolbarContainer .MuiButton-root": {
              color: "#EB001B",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-root .MuiSvgIcon-root": {
              color: "#EB001B !important",
              fill: "#EB001B !important",
              opacity: "1 !important",
            },
            "& .MuiDataGrid-toolbarContainer .MuiIconButton-root": {
              color: "#EB001B !important",
            },
            "& .MuiDataGrid-toolbarContainer .MuiIconButton-root .MuiSvgIcon-root": {
              color: "#EB001B !important",
              fill: "#EB001B",
            },
            "& .MuiDataGrid-toolbarContainer [class*='MuiDataGrid-toolbar'] .MuiSvgIcon-root": {
              color: "#EB001B !important",
              fill: "#EB001B",
            },
            "& .MuiDataGrid-toolbarContainer .MuiDataGrid-toolbarButton, & .MuiDataGrid-toolbarContainer .MuiDataGrid-toolbarButton .MuiButton-startIcon, & .MuiDataGrid-toolbarContainer .MuiDataGrid-toolbarButton .MuiSvgIcon-root": {
              color: "#EB001B !important",
              fill: "#EB001B !important",
              opacity: "1 !important",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-startIcon > *": {
              color: "#EB001B !important",
              fill: "#EB001B !important",
              opacity: "1 !important",
            },
            "& .MuiDataGrid-toolbarContainer button[aria-label*='column'], & .MuiDataGrid-toolbarContainer button[aria-label*='filter'], & .MuiDataGrid-toolbarContainer button[aria-label*='density'], & .MuiDataGrid-toolbarContainer button[aria-label*='export']": {
              color: "#EB001B !important",
            },
            "& .MuiDataGrid-toolbarContainer .MuiInputBase-root, & .MuiDataGrid-toolbarContainer .MuiInputBase-input": {
              color: "#EB001B",
            },
            "& .MuiDataGrid-toolbarContainer .MuiDataGrid-toolbarQuickFilter .MuiSvgIcon-root": {
              color: "#EB001B",
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
            "& .MuiDataGrid-iconSeparator": {
              color: "#4B5563",
            },
            "& .MuiDataGrid-sortIcon, & .MuiDataGrid-menuIconButton, & .MuiDataGrid-columnHeader .MuiSvgIcon-root": {
              color: "#F5F5F5",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #25272C",
              color: "#F5F5F6",
            },
            "& .MuiDataGrid-cellCheckbox, & .MuiDataGrid-columnHeaderCheckbox": {
              bgcolor: "#1F2023",
            },
            "& .MuiDataGrid-cellCheckbox .MuiSvgIcon-root, & .MuiDataGrid-columnHeaderCheckbox .MuiSvgIcon-root": {
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
            "& .MuiCheckbox-root": {
              color: "#9CA3AF",
            },
            "& .MuiCheckbox-root.Mui-checked": {
              color: "#EB001B",
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
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "#1F2023",
            color: "#F5F5F6",
            boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
            p: 4,
            borderRadius: 3,
            border: "1px solid #33353A",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          {selectedListing && (
            <>
              <Typography variant="h6" gutterBottom>
                Edit Listing
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                <strong>Seller:</strong> {selectedListing.name}
                <br />
                <strong>Email:</strong> {selectedListing.email}
                <br />
                <strong>Phone:</strong> {selectedListing.phone}
              </Typography>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                {(selectedListing.photos || []).map((src, idx) => (
                  <Avatar
                    key={idx}
                    variant="rounded"
                    src={src}
                    alt={`Photo ${idx + 1}`}
                    sx={{ width: 100, height: 75 }}
                  />
                ))}
              </Box>

              <TextField
                label="Title"
                name="title"
                value={selectedListing.title ?? ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                sx={{
                  "& .MuiInputLabel-root": { color: "#A5A7AC" },
                  "& .MuiOutlinedInput-root": {
                    color: "#F5F5F6",
                    "& fieldset": { borderColor: "#3A3B40" },
                    "&:hover fieldset": { borderColor: "#EB001B" },
                  },
                }}
              />

              <TextField
                select
                label="Condition"
                name="condition"
                value={selectedListing.condition ?? ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                sx={{
                  "& .MuiInputLabel-root": { color: "#A5A7AC" },
                  "& .MuiOutlinedInput-root": {
                    color: "#F5F5F6",
                    "& fieldset": { borderColor: "#3A3B40" },
                    "&:hover fieldset": { borderColor: "#EB001B" },
                  },
                }}
              >
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="used">Used</MenuItem>
              </TextField>

              <TextField
                label="Category"
                name="category"
                value={selectedListing.category ?? ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />

              <TextField
                label="Subcategory"
                name="subcategory"
                value={selectedListing.subcategory ?? ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />

              <TextField
                label="Year"
                name="year"
                value={selectedListing.year ?? ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />

              <TextField
                label="Make"
                name="make"
                value={selectedListing.make ?? ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />

              <TextField
                label="Model"
                name="model"
                value={selectedListing.model ?? ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />

              <TextField
                label="Odometer Value"
                name="odometerValue"
                value={selectedListing.odometerValue ?? ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />

              <TextField
                select
                label="Odometer Unit"
                name="odometerUnit"
                value={selectedListing.odometerUnit ?? ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                disabled={
                  selectedListing.odometerValue === null ||
                  selectedListing.odometerValue === undefined ||
                  selectedListing.odometerValue === ""
                }
              >
                <MenuItem value="km">Kilometers</MenuItem>
                <MenuItem value="mi">Miles</MenuItem>
                <MenuItem value="hrs">Hours</MenuItem>
              </TextField>

              <TextField
                label="Price"
                name="price"
                value={selectedListing.price ?? ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />

              <TextField
                label="Description"
                name="description"
                value={selectedListing.description ?? ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                multiline
                rows={4}
              />

              <TextField
                label="Interest Rate"
                name="interestRate"
                value={selectedListing.interestRate ?? ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />

              <TextField
                label="Term"
                name="term"
                value={selectedListing.term ?? ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />

              <TextField
                label="Dealership"
                name="dealership"
                value={selectedListing.dealership ?? ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />

              <Box mt={3} display="flex" justifyContent="space-between">
                <Button
                  variant="outlined"
                  onClick={handleClose}
                  sx={{ borderColor: "#4B5563", color: "#D1D5DB" }}
                >
                  Cancel
                </Button>
                <Box>
                  <Button
                    variant="contained"
                    onClick={handleMarkAsSold}
                    sx={{ mr: 2, bgcolor: "#B91C1C", "&:hover": { bgcolor: "#991B1B" } }}
                  >
                    Mark as Sold
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ bgcolor: "#EB001B", "&:hover": { bgcolor: "#C40018" } }}
                    onClick={handleSaveChanges}
                  >
                    Save Changes
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      <ImportInventoryModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={handleImport}
        file={importFile}
        setFile={setImportFile}
        dealership={importDealership}
        setDealership={setImportDealership}
      />
    </Box>
  );
};

export default Inventory;
