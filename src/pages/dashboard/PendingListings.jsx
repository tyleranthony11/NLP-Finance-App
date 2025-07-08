import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  TextField,
  TextareaAutosize,
} from "@mui/material";

const styles = {
  container: { p: 3 },
  card: { p: 2, mb: 3, borderRadius: 2, boxShadow: 3 },
  photosContainer: { mb: 2, flexWrap: "wrap" },
  photo: {
    width: 150,
    height: 100,
    objectFit: "cover",
    borderRadius: 1,
    boxShadow: 1,
    mr: 1.5,
    mb: 1.5,
  },
  buttonGroup: { mt: 1, gap: 2 },
  formField: { mb: 2 },
  textarea: {
    width: "100%",
    minHeight: 80,
    fontSize: "1rem",
    padding: 8,
    borderRadius: 4,
    borderColor: "#ccc",
    fontFamily: "Roboto, sans-serif",
  },
};

function PendingListings() {
  const [pendingListings, setPendingListings] = useState([]);
  const [reviewListing, setReviewListing] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const active = JSON.parse(localStorage.getItem("activeListings")) || [];
    setPendingListings(
      active.filter((listing) => listing.status === "pending")
    );
  }, []);

  const openReview = (listing) => {
    setReviewListing(listing);
    setFormData({ ...listing });
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const saveChanges = () => {
    const active = JSON.parse(localStorage.getItem("activeListings")) || [];
    const updated = active.map((listing) =>
      listing.id === formData.id ? { ...formData, status: "pending" } : listing
    );
    localStorage.setItem("activeListings", JSON.stringify(updated));
    setPendingListings(updated.filter((l) => l.status === "pending"));
    setReviewListing(null);
  };

  const approveListing = () => {
    const active = JSON.parse(localStorage.getItem("activeListings")) || [];
    const updated = active.map((listing) =>
      listing.id === formData.id ? { ...formData, status: "active" } : listing
    );
    localStorage.setItem("activeListings", JSON.stringify(updated));
    setPendingListings(updated.filter((l) => l.status === "pending"));
    setReviewListing(null);
  };

  const cancelReview = () => setReviewListing(null);

  return (
    <Box sx={styles.container}>
      <Typography variant="h4" gutterBottom>
        Pending Listings
      </Typography>

      {pendingListings.length === 0 && (
        <Typography>No pending listings.</Typography>
      )}

      {pendingListings.map((listing) => (
        <Paper key={listing.id} sx={styles.card}>
          <Typography variant="h6" gutterBottom>
            {listing.year} {listing.make} {listing.model}
          </Typography>
          <Typography sx={{ mb: 1 }}>{listing.description}</Typography>
          <Typography sx={{ mb: 2, fontStyle: "italic" }}>
            Seller: {listing.name} ({listing.email})
          </Typography>

          <Stack direction="row" sx={styles.photosContainer}>
            {listing.photos.map((photo, index) => (
              <Box
                key={index}
                component="img"
                src={photo}
                alt={`Listing Photo ${index + 1}`}
                sx={styles.photo}
              />
            ))}
          </Stack>

          <Stack direction="row" sx={styles.buttonGroup}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => openReview(listing)}
            >
              Review
            </Button>
          </Stack>
        </Paper>
      ))}

      {reviewListing && (
        <Paper sx={{ ...styles.card, mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Review Listing: {reviewListing.year} {reviewListing.make}{" "}
            {reviewListing.model}
          </Typography>

          <TextField
            label="Year"
            value={formData.year}
            onChange={handleChange("year")}
            sx={styles.formField}
            fullWidth
          />
          <TextField
            label="Make"
            value={formData.make}
            onChange={handleChange("make")}
            sx={styles.formField}
            fullWidth
          />
          <TextField
            label="Model"
            value={formData.model}
            onChange={handleChange("model")}
            sx={styles.formField}
            fullWidth
          />
          <TextareaAutosize
            minRows={3}
            placeholder="Description"
            value={formData.description}
            onChange={handleChange("description")}
            style={styles.textarea}
          />
          <TextField
            label="Seller Name"
            value={formData.name}
            onChange={handleChange("name")}
            sx={styles.formField}
            fullWidth
          />
          <TextField
            label="Seller Email"
            value={formData.email}
            onChange={handleChange("email")}
            sx={styles.formField}
            fullWidth
          />

          <Stack direction="row" sx={styles.buttonGroup}>
            <Button
              variant="contained"
              color="success"
              onClick={approveListing}
            >
              Approve
            </Button>
            <Button variant="outlined" onClick={saveChanges}>
              Save Changes
            </Button>
            <Button variant="text" color="error" onClick={cancelReview}>
              Cancel
            </Button>
          </Stack>
        </Paper>
      )}
    </Box>
  );
}

export default PendingListings;
