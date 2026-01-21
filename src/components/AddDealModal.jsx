import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Autocomplete,
} from "@mui/material";
import dealers from "../data/dealers";
import lenders from "../data/lenders";
import employees from "../data/employees";

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

const titleStyle = { mb: 2 };
const footerStyle = { mt: 3, display: "flex", justifyContent: "flex-end" };
const cancelButtonStyle = { mr: 2 };

export default function AddDealModal({ open, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    customerName: "",
    dealDate: "",
    dealerName: "",
    lenderName: "",
    employeeName: "",
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

  const financeFields = [
    { label: "Brokerage Fee", key: "brokerageFee" },
    { label: "Life Insurance", key: "lifeInsurance" },
    { label: "A/H Insurance", key: "ahInsurance" },
    { label: "CI Insurance", key: "ciInsurance" },
    { label: "Bank Reserve", key: "bankReserve" },
    { label: "Dealer Reserve", key: "dealerReserve" },
    { label: "NLP Reserve", key: "nlpReserve" },
    { label: "Warranty", key: "warranty" },
    { label: "GAP Insurance", key: "gapInsurance" },
    { label: "Other F&I", key: "otherFI" },
  ];

  const dealerOptions = Object.keys(dealers);
  const lenderOptions = Object.keys(lenders);
  const employeeOptions = Object.keys(employees);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = () => {
    const { customerName, dealDate, dealerName, lenderName, employeeName } =
      formData;

    if (
      !customerName.trim() ||
      !dealDate.trim() ||
      !dealerName.trim() ||
      !lenderName.trim() ||
      !employeeName.trim()
    ) {
      alert("Please fill out all required fields");
      return;
    }

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
    };

    onAdd(parsedData);
    onClose();
    setFormData({
      customerName: "",
      dealDate: "",
      dealerName: "",
      lenderName: "",
      employeeName: "",
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
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" sx={titleStyle}>
          Add New Deal
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Customer Name"
              fullWidth
              required
              value={formData.customerName}
              onChange={handleChange("customerName")}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Date"
              type="date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              value={formData.dealDate}
              onChange={handleChange("dealDate")}
            />
          </Grid>

          <Grid item xs={6}>
            <Autocomplete
              options={lenderOptions}
              value={formData.lenderName}
              onChange={(event, newValue) =>
                setFormData((prev) => ({ ...prev, lenderName: newValue || "" }))
              }
              renderInput={(params) => (
                <TextField {...params} label="Lender" fullWidth required />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              options={employeeOptions}
              value={formData.employeeName}
              onChange={(event, newValue) =>
                setFormData((prev) => ({
                  ...prev,
                  employeeName: newValue || "",
                }))
              }
              renderInput={(params) => (
                <TextField {...params} label="Employee" fullWidth required />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              options={dealerOptions}
              value={formData.dealerName}
              onChange={(event, newValue) =>
                setFormData((prev) => ({ ...prev, dealerName: newValue || "" }))
              }
              renderInput={(params) => (
                <TextField {...params} label="Dealer" fullWidth required />
              )}
            />
          </Grid>

          {financeFields.map(({ label, key }) => (
            <Grid item xs={6} key={key}>
              <TextField
                label={label}
                type="number"
                fullWidth
                value={formData[key]}
                onChange={handleChange(key)}
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
