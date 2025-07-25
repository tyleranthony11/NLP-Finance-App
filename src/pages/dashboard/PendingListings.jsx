import React, { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { IconButton } from "@mui/material";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  Avatar,
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  MenuItem,
} from "@mui/material";

const PendingListings = () => {
  const [open, setOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postings, setPostings] = useState([]);

  const [photos, setPhotos] = useState([]);
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [kms, setKms] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [term, setTerm] = useState("");
  const [dealership, setDealership] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("listings")) || [];
    const pending = stored.filter((post) => post.status === "pending");
    setPostings(pending);
  }, []);

  const handleOpen = (post) => {
    setSelectedPost(post);
    setPhotos(post.photos || []);
    setCategory(post.category || "");
    setYear(post.year || "");
    setMake(post.make || "");
    setModel(post.model || "");
    setKms(post.kms || "");
    setPrice(post.price || "");
    setDescription(post.description || "");
    setInterestRate(post.interestRate || "");
    setTerm(post.term || "");
    setDealership(post.dealership || "");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPost(null);
    setYear("");
    setMake("");
    setModel("");
    setKms("");
    setPrice("");
    setDescription("");
    setInterestRate("");
    setTerm("");
    setDealership("");
  };

  const handleApprove = () => {
    if (!selectedPost) return;

    const allListings = JSON.parse(localStorage.getItem("listings")) || [];

    const updatedListings = allListings.map((post) =>
      post.id === selectedPost.id
        ? {
            ...post,
            status: "active",
            photos,
            category,
            year,
            make,
            model,
            kms,
            price: Number(price),
            description,
            interestRate: Number(interestRate),
            term: Number(term),
            dealership,
          }
        : post
    );

    localStorage.setItem("listings", JSON.stringify(updatedListings));
    setPostings((prev) => prev.filter((post) => post.id !== selectedPost.id));
    handleClose();
  };

  return (
    <>
      {postings.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          There are no pending listings to review.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Photo</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Make</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Review</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {postings.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <Avatar
                      variant="rounded"
                      src={post.photos[0]}
                      alt={`${post.make} ${post.model}`}
                      sx={{ width: 64, height: 40 }}
                    />
                  </TableCell>
                  <TableCell>{post.name}</TableCell>
                  <TableCell>{post.email}</TableCell>
                  <TableCell>{post.phone}</TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>{post.year}</TableCell>
                  <TableCell>{post.make}</TableCell>
                  <TableCell>{post.model}</TableCell>
                  <TableCell>{post.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleOpen(post)}
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
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
          {selectedPost && (
            <>
              <Typography variant="h6" gutterBottom>
                Review Listing
              </Typography>

              <Typography>
                <strong>Name:</strong> {selectedPost.name}
              </Typography>
              <Typography>
                <strong>Email:</strong> {selectedPost.email}
              </Typography>
              <Typography mb={2}>
                <strong>Phone:</strong> {selectedPost.phone}
              </Typography>

              <Box mt={2}>
                <Typography variant="subtitle1" gutterBottom>
                  Photos
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {photos.map((src, index) => (
                    <Box key={index} sx={{ position: "relative" }}>
                      <Avatar
                        variant="rounded"
                        src={src}
                        alt={`Photo ${index + 1}`}
                        sx={{ width: 100, height: 75 }}
                      />

                      <IconButton
                        size="small"
                        color="error"
                        sx={{ position: "absolute", top: -10, right: -10 }}
                        onClick={() => {
                          const updated = [...photos];
                          updated.splice(index, 1);
                          setPhotos(updated);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>

                      {index > 0 && (
                        <IconButton
                          size="small"
                          sx={{ position: "absolute", bottom: -24, left: 0 }}
                          onClick={() => {
                            const updated = [...photos];
                            [updated[index - 1], updated[index]] = [
                              updated[index],
                              updated[index - 1],
                            ];
                            setPhotos(updated);
                          }}
                        >
                          <ArrowUpwardIcon fontSize="small" />
                        </IconButton>
                      )}

                      {index < photos.length - 1 && (
                        <IconButton
                          size="small"
                          sx={{ position: "absolute", bottom: -24, right: 0 }}
                          onClick={() => {
                            const updated = [...photos];
                            [updated[index], updated[index + 1]] = [
                              updated[index + 1],
                              updated[index],
                            ];
                            setPhotos(updated);
                          }}
                        >
                          <ArrowDownwardIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                </Box>

                <Button variant="outlined" component="label" sx={{ mt: 3 }}>
                  Add Photo
                  <input
                    hidden
                    accept="image/*"
                    multiple
                    type="file"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      const readers = files.map((file) => {
                        return new Promise((resolve) => {
                          const reader = new FileReader();
                          reader.onload = (event) =>
                            resolve(event.target.result);
                          reader.readAsDataURL(file);
                        });
                      });

                      Promise.all(readers).then((newPhotos) => {
                        setPhotos((prev) => [...prev, ...newPhotos]);
                      });
                    }}
                  />
                </Button>
              </Box>

              <TextField
                select
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                fullWidth
                margin="normal"
              >
                <MenuItem value="powersports">Powersports</MenuItem>
                <MenuItem value="marine">Marine</MenuItem>
                <MenuItem value="rv">RV / Travel Trailer</MenuItem>
                <MenuItem value="automotive">Automotive</MenuItem>
              </TextField>
              <TextField
                label="Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Make"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Kilometers"
                value={kms}
                onChange={(e) => setKms(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                margin="normal"
                multiline
                rows={4}
              />

              <TextField
                label="Interest Rate (%)"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                fullWidth
                margin="normal"
              />

              <TextField
                label="Term (Months)"
                select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                fullWidth
                margin="normal"
              >
                {[24, 36, 48, 60, 72, 84, 96, 120, 180, 240].map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Dealership"
                value={dealership}
                onChange={(e) => setDealership(e.target.value)}
                fullWidth
                margin="normal"
              />

              <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="outlined" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleApprove}
                >
                  Approve & Save
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default PendingListings;
