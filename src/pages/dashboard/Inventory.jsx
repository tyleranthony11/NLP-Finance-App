import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Modal,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { NumericFormat } from "react-number-format";
import ImportInventoryModal from "../../components/ImportInventoryModal";

import { capitalizeFirstLetter } from "../../utils.js";

const Inventory = () => {
  const [listings, setListings] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [importOpen, setImportOpen] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importDealership, setImportDealership] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/marketplace/admin`,
        );
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

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/marketplace/${selectedListing.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

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
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/marketplace/${selectedListing.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "sold" }),
        },
      );

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

      const res = await fetch(url, {
        method: "POST",
        body: fd,
      });

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

      year: listing.year || "",
      make: listing.make || "",
      model: listing.model || "",

      odometerValue: listing.odometerValue ?? "",
      odometerUnit: listing.odometerUnit ?? "",

      price: listing.price || "",
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
        height: "calc(100vh - 75px)",
        width: "100%",
        p: 3,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Inventory
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setImportOpen(true)}
        >
          Import CSV
        </Button>
      </Box>

      <DataGrid
        showToolbar
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        disableSelectionOnClick
        onRowClick={handleRowClick}
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
      />

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
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
              />

              <TextField
                select
                label="Condition"
                name="condition"
                value={selectedListing.condition ?? ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
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
                <Button variant="outlined" onClick={handleClose}>
                  Cancel
                </Button>
                <Box>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleMarkAsSold}
                    sx={{ mr: 2 }}
                  >
                    Mark as Sold
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
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
