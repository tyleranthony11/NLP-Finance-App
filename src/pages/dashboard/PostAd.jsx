import React, { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  Paper,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import dealers from "../../data/dealers";
import { Autocomplete } from "@mui/material";

const PostAd = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    year: "",
    make: "",
    model: "",
    kms: "",
    price: "",
    description: "",
    interestRate: "",
    term: "",
    dealership: "",
    photos: [],
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    const base64Photos = await Promise.all(
      files.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    );

    setForm((prev) => ({
      ...prev,
      photos: [...prev.photos, ...base64Photos],
    }));
  };

  const handleSubmit = () => {
    const newListing = {
      ...form,
      id: Date.now(),
      status: "active",
      price: Number(form.price),
      year: Number(form.year),
      kms: Number(form.kms),
      interestRate: Number(form.interestRate),
      term: Number(form.term),
    };

    const existing = JSON.parse(localStorage.getItem("listings")) || [];
    localStorage.setItem("listings", JSON.stringify([...existing, newListing]));

    alert("Listing created successfully!");
    setForm({
      name: "",
      email: "",
      phone: "",
      category: "",
      year: "",
      make: "",
      model: "",
      kms: "",
      price: "",
      description: "",
      interestRate: "",
      term: "",
      dealership: "",
      photos: [],
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Create a New Listing
      </Typography>

      <TextField
        label="Name"
        value={form.name}
        onChange={handleChange("name")}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        value={form.email}
        onChange={handleChange("email")}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Phone"
        value={form.phone}
        onChange={handleChange("phone")}
        fullWidth
        margin="normal"
      />

      <TextField
        select
        label="Category"
        value={form.category}
        onChange={handleChange("category")}
        fullWidth
        margin="normal"
      >
        <MenuItem value="automotive">Automotive</MenuItem>
        <MenuItem value="powersports">Powersports</MenuItem>
        <MenuItem value="marine">Marine</MenuItem>
        <MenuItem value="rv">RV / Travel Trailer</MenuItem>
      </TextField>

      <TextField
        label="Year"
        value={form.year}
        onChange={handleChange("year")}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Make"
        value={form.make}
        onChange={handleChange("make")}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Model"
        value={form.model}
        onChange={handleChange("model")}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Kilometers"
        value={form.kms}
        onChange={handleChange("kms")}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Price"
        value={form.price}
        onChange={handleChange("price")}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        value={form.description}
        onChange={handleChange("description")}
        fullWidth
        margin="normal"
        multiline
        rows={4}
      />

      <TextField
        label="Interest Rate (%)"
        value={form.interestRate}
        onChange={handleChange("interestRate")}
        fullWidth
        margin="normal"
      />
      <TextField
        select
        label="Term (Months)"
        value={form.term}
        onChange={handleChange("term")}
        fullWidth
        margin="normal"
      >
        {[24, 36, 48, 60, 72, 84, 96, 120, 180, 240].map((term) => (
          <MenuItem key={term} value={term}>
            {term}
          </MenuItem>
        ))}
      </TextField>
      <Autocomplete
        options={Object.keys(dealers)}
        value={form.dealership}
        onChange={(event, newValue) => {
          setForm((prev) => ({
            ...prev,
            dealership: newValue || "",
          }));
        }}
        renderInput={(params) => (
          <TextField {...params} label="Dealership" margin="normal" fullWidth />
        )}
        isOptionEqualToValue={(option, value) => option === value}
      />

      <Box mt={2}>
        <Button variant="outlined" component="label">
          Upload Photos
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handlePhotoUpload}
          />
        </Button>

        {form.photos.length > 0 && (
          <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
            {form.photos.map((src, idx) => (
              <Avatar
                key={idx}
                src={src}
                variant="rounded"
                alt={`Photo ${idx + 1}`}
                sx={{ width: 100, height: 75 }}
              />
            ))}
          </Box>
        )}
      </Box>

      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Post Ad
        </Button>
      </Box>
    </Paper>
  );
};

export default PostAd;
