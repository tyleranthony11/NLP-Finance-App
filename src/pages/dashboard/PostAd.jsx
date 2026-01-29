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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MAX_PHOTOS = 10;

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

    if (!form.photos || form.photos.length < 1) {
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
      !form.price ||
      !form.description ||
      !form.condition
    ) {
      toast.error("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Only send odometer fields if there is a value
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
        condition: form.condition, // "new" | "used"

        year: Number(form.year),
        make: form.make,
        model: form.model,

        odometerValue: odoValue,
        odometerUnit: odoValue ? form.odometerUnit : null, // "km" | "mi" | "hrs"

        price: Number(form.price),
        description: form.description,
        photos: form.photos,
      };

      const createRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/marketplace`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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

      const updateRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/marketplace/${created.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatePayload),
        },
      );

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
    } catch (err) {
      console.error("Post Ad failed:", err);
      toast.error("Failed to create listing.");
    } finally {
      setIsSubmitting(false);
    }
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
        label="Subcategory"
        value={form.subcategory}
        onChange={handleChange("subcategory")}
        fullWidth
        margin="normal"
        placeholder="e.g. ATV, Side-by-side, Dirt Bike, Snowmobile"
      />

      <TextField
        select
        label="Condition"
        value={form.condition}
        onChange={handleChange("condition")}
        fullWidth
        margin="normal"
      >
        <MenuItem value="new">New</MenuItem>
        <MenuItem value="used">Used</MenuItem>
      </TextField>

      <TextField
        label="Title (optional)"
        value={form.title}
        onChange={handleChange("title")}
        fullWidth
        margin="normal"
        placeholder="Leave blank to auto-generate"
      />

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

      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          label="Odometer (optional)"
          value={form.odometerValue}
          onChange={handleChange("odometerValue")}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          select
          label="Unit"
          value={form.odometerUnit}
          onChange={handleChange("odometerUnit")}
          sx={{ width: 140 }}
          margin="normal"
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
          <TextField {...params} label="Dealership" margin="normal" fullWidth />
        )}
        isOptionEqualToValue={(option, value) => option === value}
      />

      <Box mt={2}>
        <Button variant="outlined" component="label">
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
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Posting..." : "Post Ad"}
        </Button>
      </Box>

      <ToastContainer position="top-center" autoClose={3000} />
    </Paper>
  );
};

export default PostAd;
