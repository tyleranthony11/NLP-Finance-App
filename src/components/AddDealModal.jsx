import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button, Grid } from "@mui/material";
import "./AddDealModal.css";

const AddDealModal = ({ open, onClose, onAddDeal }) => {
  const initialState = {
    customer: "",
    dealer: "",
    lender: "",
    brokerageFee: "",
    lifeInsurance: "",
    ahInsurance: "",
    ciInsurance: "",
    gapInsurance: "",
    warranty: "",
    bankReserve: "",
    dealerReserve: "",
    nlpReserve: "",
    otherFI: "",
    date: "",
  };

  const [dealData, setDealData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setDealData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSave = () => {
    const income =
      Number(dealData.brokerageFee) +
      Number(dealData.lifeInsurance) +
      Number(dealData.ahInsurance) +
      Number(dealData.ciInsurance) +
      Number(dealData.gapInsurance) +
      Number(dealData.warranty) +
      Number(dealData.bankReserve) +
      Number(dealData.dealerReserve) -
      Number(dealData.nlpReserve) +
      Number(dealData.otherFI || 0);

    const newDeal = {
      customer: dealData.customer,
      date: dealData.date,
      income,
    };

    onAddDeal(newDeal);
    setDealData(initialState);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="add-deal-modal">
        <Typography variant="h6" gutterBottom>
          Add New Funded Deal
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Customer Name"
              name="customer"
              value={dealData.customer}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Dealer Name"
              name="dealer"
              value={dealData.dealer}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Lender Name"
              name="lender"
              fullWidth
              value={dealData.lender}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Brokerage Fee"
              name="brokerageFee"
              type="number"
              value={dealData.brokerageFee}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Life Insurance"
              name="lifeInsurance"
              type="number"
              value={dealData.lifeInsurance}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="A/H Insurance"
              name="ahInsurance"
              type="number"
              value={dealData.ahInsurance}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="CI Insurance"
              name="ciInsurance"
              type="number"
              value={dealData.ciInsurance}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="GAP Insurance"
              name="gapInsurance"
              type="number"
              value={dealData.gapInsurance}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Warranty"
              name="warranty"
              type="number"
              value={dealData.warranty}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Bank Reserve"
              name="bankReserve"
              type="number"
              value={dealData.bankReserve}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Dealer Reserve"
              name="dealerReserve"
              type="number"
              value={dealData.dealerReserve}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="NLP Finance Reserve"
              name="nlpReserve"
              type="number"
              value={dealData.nlpReserve}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Other F&I"
              name="otherFI"
              type="number"
              value={dealData.otherFI}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Deal Date"
              name="date"
              type="date"
              fullWidth
              required
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              value={dealData.date}
              onChange={handleChange}
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
            <Button variant="contained" color="success" onClick={handleSave}>
              Save
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default AddDealModal;
