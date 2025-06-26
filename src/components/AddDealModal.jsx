import React, { useState } from "react";
import { Modal, Box, TextField, Button, Grid, Typography } from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  p: 4,
  borderRadius: 2,
};

const titleStyle = {
  mb: 2,
};

const formGridStyle = {
  spacing: 2,
};

const footerStyle = {
  mt: 3,
  display: "flex",
  justifyContent: "flex-end",
};

const cancelButtonStyle = {
  mr: 2,
};

export default function AddDealModal({ open, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    customer: "",
    date: "",
    dealer: "",
    lender: "",
    brokerageFee: "",
    lifeInsurance: "",
    ahInsurance: "",
    ciInsurance: "",
    bankReserve: "",
    dealerReserve: "",
    nlpReserve: "",
    warranty: "",
    gapInsurance: "",
    otherFI: "",
  });

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = () => {
    const parsedData = {
      ...formData,
      brokerageFee: parseFloat(formData.brokerageFee || 0),
      lifeInsurance: parseFloat(formData.lifeInsurance || 0),
      ahInsurance: parseFloat(formData.ahInsurance || 0),
      ciInsurance: parseFloat(formData.ciInsurance || 0),
      bankReserve: parseFloat(formData.bankReserve || 0),
      dealerReserve: parseFloat(formData.dealerReserve || 0),
      nlpReserve: parseFloat(formData.nlpReserve || 0),
      warranty: parseFloat(formData.warranty || 0),
      gapInsurance: parseFloat(formData.gapInsurance || 0),
      otherFI: parseFloat(formData.otherFI || 0),
      income:
        parseFloat(formData.brokerageFee || 0) +
        parseFloat(formData.lifeInsurance || 0) +
        parseFloat(formData.ahInsurance || 0) +
        parseFloat(formData.ciInsurance || 0) +
        parseFloat(formData.bankReserve || 0) +
        parseFloat(formData.dealerReserve || 0) +
        parseFloat(formData.nlpReserve || 0) +
        parseFloat(formData.warranty || 0) +
        parseFloat(formData.gapInsurance || 0) +
        parseFloat(formData.otherFI || 0),
    };

    onAdd(parsedData);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" sx={titleStyle}>
          Add New Deal
        </Typography>

        <Grid container {...formGridStyle}>
          <Grid item xs={12}>
            <TextField
              label="Customer Name"
              fullWidth
              value={formData.customer}
              onChange={handleChange("customer")}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.date}
              onChange={handleChange("date")}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Dealer"
              fullWidth
              value={formData.dealer}
              onChange={handleChange("dealer")}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Lender"
              fullWidth
              value={formData.lender}
              onChange={handleChange("lender")}
            />
          </Grid>
          {[
            "Brokerage Fee",
            "Life Insurance",
            "A/H Insurance",
            "CI Insurance",
            "Bank Reserve",
            "Dealer Reserve",
            "NLP Reserve",
            "Warranty",
            "GAP Insurance",
            "Other F&I",
          ].map((field) => (
            <Grid item xs={6} key={field}>
              <TextField
                label={field}
                type="number"
                fullWidth
                value={formData[field]}
                onChange={handleChange(field)}
              />
            </Grid>
          ))}
        </Grid>

        <Box sx={footerStyle}>
          <Button onClick={onClose} sx={cancelButtonStyle}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Add Deal
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
