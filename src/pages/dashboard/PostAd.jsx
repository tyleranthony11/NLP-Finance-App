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
import { Autocomplete } from "@mui/material";
import dealers from "../../data/dealers";
import { authFetch } from "../../auth/authFetch.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MAX_PHOTOS = 10;
const darkInputSx = {
  "& .MuiInputLabel-root": { color: "#A5A7AC" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#EB001B" },
  "& .MuiOutlinedInput-root": {
    color: "#F5F5F6",
    "& fieldset": { borderColor: "#3A3B40" },
    "&:hover fieldset": { borderColor: "#EB001B" },
    "&.Mui-focused fieldset": { borderColor: "#EB001B" },
    "& input::placeholder": { color: "#8B8E95", opacity: 1 },
    "& textarea::placeholder": { color: "#8B8E95", opacity: 1 },
  },
};

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const PostAd = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    subcategory: "",
    condition: "used",
    title: "",
    year: "",
    make: "",
    model: "",
    odometerValue: "",
    odometerUnit: "km",
    price: "",
    description: "",
    interestRate: "",
    term: "",
    dealership: "",
    photos: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      category: "",
      subcategory: "",
      condition: "used",
      title: "",
      year: "",
      make: "",
      model: "",
      odometerValue: "",
      odometerUnit: "km",
      price: "",
      description: "",
      interestRate: "",
      term: "",
      dealership: "",
      photos: [],
    });
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files || []);

    if (form.photos.length + files.length > MAX_PHOTOS) {
      toast.error(`You can upload a maximum of ${MAX_PHOTOS} photos.`);
      e.target.value = "";
      return;
    }

    try {
      const base64Photos = await Promise.all(files.map(fileToBase64));
      setForm((prev) => ({
        ...prev,
        photos: [...prev.photos, ...base64Photos],
      }));
    } catch (err) {
      console.error("Photo upload failed:", err);
      toast.error("Failed to read one of the photos.");
    } finally {
      e.target.value = "";
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!form.photos.length) {
      toast.error("Please upload at least one photo.");
      return;
    }

    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.category ||
      !form.year ||
      !form.make ||
      !form.model ||
      !form.description ||
      !form.condition
    ) {
      toast.error("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const odoValue =
        form.odometerValue === "" || form.odometerValue === null
          ? null
          : Number(form.odometerValue);

      const createPayload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        category: form.category,
        subcategory: form.subcategory?.trim() ? form.subcategory.trim() : null,
        title: form.title?.trim() ? form.title.trim() : "",
        condition: form.condition,
        year: Number(form.year),
        make: form.make,
        model: form.model,
        odometerValue: odoValue,
        odometerUnit: odoValue ? form.odometerUnit : null,
        price: Number(form.price),
        description: form.description,
        photos: form.photos,
      };

      const createRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/marketplace`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(createPayload),
        },
      );

      const createJson = await createRes.json();

      if (!createRes.ok || !createJson?.success) {
        console.error("Create listing failed:", createJson);
        toast.error(
          createJson?.message ||
            `Failed to create listing (${createRes.status})`,
        );
        return;
      }

      const created = createJson.data;

      const updatePayload = {
        status: "active",
        dealership: form.dealership || null,
        interestRate: form.interestRate ? Number(form.interestRate) : null,
        term: form.term ? Number(form.term) : null,
      };

      const updateRes = await authFetch(
        `${import.meta.env.VITE_API_URL}/api/marketplace/${created.id}`,
        {
          method: "PUT",
          body: JSON.stringify(updatePayload),
        },
      );

      if (!updateRes) {
        toast.error("Created listing, but failed to activate it.");
        return;
      }

      const updateJson = await updateRes.json();

      if (!updateRes.ok || !updateJson?.success) {
        console.error("Activate listing failed:", updateJson);
        toast.error(
          updateJson?.message ||
            `Created but failed to activate (${updateRes.status})`,
        );
        return;
      }

      toast.success("Listing created and added to inventory!");
      resetForm();
    } catch (err) {
      console.error("Post Ad failed:", err);
      toast.error("Failed to create listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ height: "100%", minHeight: 0, overflow: "hidden" }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          maxWidth: 1200,
          mx: "auto",
          mt: 1,
          mb: 1,
          borderRadius: 3,
          border: "1px solid #2B2B2F",
          bgcolor: "#1F2023",
          color: "#F5F5F6",
          boxShadow: "0 16px 30px rgba(0,0,0,0.35)",
        }}
      >
      <Typography variant="h5" sx={{ fontWeight: 700 }} gutterBottom>
        Create a New Listing
      </Typography>
      <Typography variant="body2" sx={{ color: "#A5A7AC", mb: 2 }}>
        Add a marketplace unit with details, pricing, and photos.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2,
          alignItems: "start",
        }}
      >
        <TextField
          label="Name"
          value={form.name}
          onChange={handleChange("name")}
          fullWidth
          size="small"
          sx={darkInputSx}
        />
        <TextField
          label="Email"
          value={form.email}
          onChange={handleChange("email")}
          fullWidth
          size="small"
          sx={darkInputSx}
        />
        <TextField
          label="Phone"
          value={form.phone}
          onChange={handleChange("phone")}
          fullWidth
          size="small"
          sx={darkInputSx}
        />
        <TextField
          select
          label="Category"
          value={form.category}
          onChange={handleChange("category")}
          fullWidth
          size="small"
          sx={darkInputSx}
        >
          <MenuItem value="automotive">Automotive</MenuItem>
          <MenuItem value="powersports">Powersports</MenuItem>
          <MenuItem value="marine">Marine</MenuItem>
          <MenuItem value="rv">RV / Travel Trailer</MenuItem>
        </TextField>
        <TextField
          label="Subcategory"
          value={form.subcategory}
          onChange={handleChange("subcategory")}
          fullWidth
          size="small"
          placeholder="e.g. ATV, Side-by-side, Dirt Bike, Snowmobile"
          sx={darkInputSx}
        />
        <TextField
          select
          label="Condition"
          value={form.condition}
          onChange={handleChange("condition")}
          fullWidth
          size="small"
          sx={darkInputSx}
        >
          <MenuItem value="new">New</MenuItem>
          <MenuItem value="used">Used</MenuItem>
        </TextField>
        <TextField
          label="Title (optional)"
          value={form.title}
          onChange={handleChange("title")}
          fullWidth
          size="small"
          placeholder="Leave blank to auto-generate"
          sx={darkInputSx}
        />
        <TextField
          label="Year"
          value={form.year}
          onChange={handleChange("year")}
          fullWidth
          size="small"
          sx={darkInputSx}
        />
        <TextField
          label="Make"
          value={form.make}
          onChange={handleChange("make")}
          fullWidth
          size="small"
          sx={darkInputSx}
        />
        <TextField
          label="Model"
          value={form.model}
          onChange={handleChange("model")}
          fullWidth
          size="small"
          sx={darkInputSx}
        />
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <TextField
            label="Odometer (optional)"
            value={form.odometerValue}
            onChange={handleChange("odometerValue")}
            fullWidth
            type="number"
            size="small"
            sx={darkInputSx}
          />
          <TextField
            select
            label="Unit"
            value={form.odometerUnit}
            onChange={handleChange("odometerUnit")}
            size="small"
            sx={{ width: 120, ...darkInputSx }}
          >
            <MenuItem value="km">km</MenuItem>
            <MenuItem value="mi">mi</MenuItem>
            <MenuItem value="hrs">hrs</MenuItem>
          </TextField>
        </Box>
        <TextField
          label="Price"
          value={form.price}
          onChange={handleChange("price")}
          fullWidth
          size="small"
          sx={darkInputSx}
        />
        <TextField
          select
          label="Interest Rate (%)"
          value={form.interestRate}
          onChange={handleChange("interestRate")}
          fullWidth
          size="small"
          sx={darkInputSx}
        >
          {[5.99, 6.99, 7.99, 8.99, 9.99, 10.99, 11.99].map((t) => (
            <MenuItem key={t} value={t}>
              {t}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Term (Months)"
          value={form.term}
          onChange={handleChange("term")}
          fullWidth
          size="small"
          sx={darkInputSx}
        >
          {[24, 36, 48, 60, 72, 84, 96, 120, 180, 240].map((t) => (
            <MenuItem key={t} value={t}>
              {t}
            </MenuItem>
          ))}
        </TextField>
        <Autocomplete
          options={Object.keys(dealers)}
          value={form.dealership}
          onChange={(_event, newValue) => {
            setForm((prev) => ({ ...prev, dealership: newValue || "" }));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Dealership"
              fullWidth
              size="small"
              sx={darkInputSx}
            />
          )}
          isOptionEqualToValue={(option, value) => option === value}
        />
        <Box sx={{ gridColumn: "1 / -1" }}>
          <TextField
            label="Description"
            value={form.description}
            onChange={handleChange("description")}
            fullWidth
            multiline
            rows={3}
            sx={darkInputSx}
          />
        </Box>
        <Box sx={{ gridColumn: "1 / -1", mt: 0.5 }}>
        <Button
          variant="outlined"
          component="label"
          sx={{
            borderColor: "#4B5563",
            color: "#E5E7EB",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              borderColor: "#EB001B",
              backgroundColor: "rgba(235,0,27,0.08)",
            },
          }}
        >
          Upload Photos (min 1, max 10)
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handlePhotoUpload}
          />
        </Button>

        {form.photos.length > 0 && (
          <Box
            mt={2}
            display="flex"
            flexWrap="wrap"
            gap={1}
            sx={{ p: 1, borderRadius: 2, bgcolor: "#18191A", border: "1px solid #2B2B2F" }}
          >
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
        <Box sx={{ gridColumn: "1 / -1", mt: 1, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
            sx={{
              bgcolor: "#EB001B",
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 2,
              px: 3,
              "&:hover": { bgcolor: "#C40018" },
            }}
          >
            {isSubmitting ? "Posting..." : "Post Ad"}
          </Button>
        </Box>
      </Box>

        <ToastContainer position="top-center" autoClose={3000} />
      </Paper>
    </Box>
  );
};

export default PostAd;
