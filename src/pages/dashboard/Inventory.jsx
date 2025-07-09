import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Modal,
  Button,
  Stack,
  TextField,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

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

  const columns = [
    {
      field: "photo",
      headerName: "Photo",
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Avatar
          variant="rounded"
          src={params.value}
          alt={`${params.row.make} ${params.row.model}`}
          sx={{ width: 64, height: 40 }}
        />
      ),
    },
    { field: "category", headerName: "Category", width: 130 },
    { field: "year", headerName: "Year", width: 100 },
    { field: "make", headerName: "Make", width: 130 },
    { field: "model", headerName: "Model", width: 130 },
    { field: "price", headerName: "Price", width: 110 },
    { field: "kms", headerName: "KMs", width: 100 },
    { field: "name", headerName: "Seller", width: 140 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone", width: 140 },
    { field: "dealership", headerName: "Dealership", width: 150 },
    { field: "interestRate", headerName: "Interest Rate (%)", width: 150 },
    { field: "term", headerName: "Term (Months)", width: 140 },
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
        autoHeight={false}
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

              <Box mt={3} display="flex" justifyContent="flex-end">
                <Button variant="contained" onClick={handleClose}>
                  Close
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
