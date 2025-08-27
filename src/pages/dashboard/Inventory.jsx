import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Modal,
  Button,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { NumericFormat } from "react-number-format";
import { capitalizeFirstLetter } from "../../utils.js";

const Inventory = () => {
  const [approvedListings, setApprovedListings] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  useEffect(() => {
    const listings = JSON.parse(localStorage.getItem("listings")) || [];
    const active = listings.filter((post) => post.status === "active");
    setApprovedListings(active);
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

  const handleSaveChanges = () => {
    const listings = JSON.parse(localStorage.getItem("listings")) || [];

    const updated = listings.map((item) =>
      item.id === selectedListing.id ? { ...item, ...selectedListing } : item
    );

    localStorage.setItem("listings", JSON.stringify(updated));

    const active = updated.filter((post) => post.status === "active");
    setApprovedListings(active);
    handleClose();
  };

  const handleMarkAsSold = () => {
    const listings = JSON.parse(localStorage.getItem("listings")) || [];

    const updatedListings = listings.map((post) =>
      post.id === selectedListing.id ? { ...post, status: "sold" } : post
    );

    localStorage.setItem("listings", JSON.stringify(updatedListings));

    const active = updatedListings.filter((post) => post.status === "active");
    setApprovedListings(active);
    handleClose();
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
      minWidth: 80,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => capitalizeFirstLetter(params.value),
    },
    {
      field: "year",
      headerName: "Year",
      flex: 0.5,
      minWidth: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "make",
      headerName: "Make",
      flex: 1,
      minWidth: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "model",
      headerName: "Model",
      flex: 1,
      minWidth: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.5,
      minWidth: 80,
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
      field: "kms",
      headerName: "KMs",
      flex: 0.5,
      minWidth: 80,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <NumericFormat
          value={params.value}
          displayType="text"
          thousandSeparator
        />
      ),
    },
    {
      field: "name",
      headerName: "Seller",
      flex: 0.5,
      minWidth: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 0.5,
      minWidth: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 0.5,
      minWidth: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "dealership",
      headerName: "Dealership",
      flex: 1,
      minWidth: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "interestRate",
      headerName: "Interest Rate (%)",
      flex: 0.5,
      minWidth: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "term",
      headerName: "Term (Months)",
      flex: 0.5,
      minWidth: 80,
      headerAlign: "center",
      align: "center",
    },
  ];

  const rows = approvedListings.map((listing) => ({
    id: listing.id,
    photo: listing.photos?.[0] || "",
    category: listing.category || "",
    year: listing.year || "",
    make: listing.make || "",
    model: listing.model || "",
    price: listing.price || "",
    kms: listing.kms || "",
    description: listing.description || "",
    name: listing.name || "",
    email: listing.email || "",
    phone: listing.phone || "",
    photos: listing.photos || [],
    interestRate: listing.interestRate || "",
    term: listing.term || "",
    dealership: listing.dealership || "",
    status: listing.status || "active",
  }));

  return (
    <Box sx={{ height: 600, width: "100%", padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Inventory
      </Typography>

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
              year: true,
              make: true,
              model: true,
              price: true,
              dealership: true,
              category: false,
              kms: false,
              name: false,
              email: false,
              phone: false,
              interestRate: false,
              term: false,
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
                {selectedListing.photos.map((src, idx) => (
                  <Avatar
                    key={idx}
                    variant="rounded"
                    src={src}
                    alt={`Photo ${idx + 1}`}
                    sx={{ width: 100, height: 75 }}
                  />
                ))}
              </Box>

              {[
                "year",
                "make",
                "model",
                "kms",
                "price",
                "description",
                "interestRate",
                "term",
                "dealership",
              ].map((field) => (
                <TextField
                  key={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  value={selectedListing[field]}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  multiline={field === "description"}
                  rows={field === "description" ? 4 : 1}
                />
              ))}

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
    </Box>
  );
};

export default Inventory;
