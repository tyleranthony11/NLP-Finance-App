import React, { useEffect, useState } from "react";
import { Typography, Box, Paper } from "@mui/material";

const Inventory = () => {
  const [approvedListings, setApprovedListings] = useState([]);

  useEffect(() => {
    const active = JSON.parse(localStorage.getItem("activeListings")) || [];
    const approved = active.filter((listing) => listing.status === "active");
    console.log("All Listings:", active);
    console.log("Filtered Active Listings:", approved);
    setApprovedListings(approved);
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Inventory
      </Typography>

      {approvedListings.length === 0 ? (
        <Typography>No approved listings yet.</Typography>
      ) : (
        approvedListings.map((listing) => (
          <Paper
            key={listing.id}
            sx={{
              padding: 2,
              marginBottom: 2,
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          >
            <Typography variant="h6">
              {listing.year} {listing.make} {listing.model}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {listing.description}
            </Typography>
            {listing.kms && (
              <Typography variant="body2">
                <strong>Kilometers:</strong> {listing.kms}
              </Typography>
            )}
            <Typography variant="body2">
              <strong>Seller:</strong> {listing.name} ({listing.email})
            </Typography>
            {listing.photos?.length > 0 && (
              <img
                src={listing.photos[0]}
                alt="Listing"
                style={{
                  marginTop: 10,
                  maxWidth: "200px",
                  borderRadius: "4px",
                }}
              />
            )}
          </Paper>
        ))
      )}
    </Box>
  );
};

export default Inventory;
