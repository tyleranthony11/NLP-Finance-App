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

  const handleMarkAsSold = () => {
    const listings = JSON.parse(localStorage.getItem("listings")) || [];

    const updatedListings = listings.map((post) =>
      post.id === selectedListing.id ? { ...post, status: "sold" } : post
    );

    localStorage.setItem("listings", JSON.stringify(updatedListings));
    setOpen(false);
    setSelectedListing(null);

    const active = updatedListings.filter((post) => post.status === "active");
    setApprovedListings(active);
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
  }));

  return (
    <Box sx={{ height: 600, width: "100%", padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Inventory
      </Typography>

      <DataGrid
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
                Review Listing
              </Typography>

              <Typography>
                <strong>Name:</strong> {selectedListing.name}
              </Typography>
              <Typography>
                <strong>Email:</strong> {selectedListing.email}
              </Typography>
              <Typography mb={2}>
                <strong>Phone:</strong> {selectedListing.phone}
              </Typography>

              <Box mt={2}>
                <Typography variant="subtitle1" gutterBottom>
                  Photos
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
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
              </Box>

              <TextField
                label="Year"
                value={selectedListing.year}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Make"
                value={selectedListing.make}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Model"
                value={selectedListing.model}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Kilometers"
                value={selectedListing.kms}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Price"
                value={selectedListing.price}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Description"
                value={selectedListing.description}
                fullWidth
                margin="normal"
                multiline
                rows={4}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Interest Rate (%)"
                value={selectedListing.interestRate}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Term (Months)"
                value={selectedListing.term}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Dealership"
                value={selectedListing.dealership}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
              />

              <Box mt={3} display="flex" justifyContent="space-between">
                <Button variant="outlined" onClick={handleClose}>
                  Close
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleMarkAsSold}
                >
                  Mark as Sold
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Inventory;
