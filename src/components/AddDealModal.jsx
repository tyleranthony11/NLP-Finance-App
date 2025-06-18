import React from "react";
import { Modal, Box, Typography, TextField, Button, Grid } from "@mui/material";
import "./AddDealModal.css";

const AddDealModal = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box className="add-deal-modal">
        <Typography variant="h6" gutterBottom>
          Add New Funded Deal
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label="Customer Name" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Dealer Name" fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Brokerage Fee" type="number" fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Life Insurance" type="number" fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="A/H Insurance" type="number" fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="CI Insurance" type="number" fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Bank Reserve" type="number" fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Dealer Reserve" type="number" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Date"
              type="date"
              fullWidth
              slotProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "right" }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 1 }}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button variant="contained" color="success">
              Save
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default AddDealModal;
