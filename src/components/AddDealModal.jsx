import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Autocomplete,
  Divider,
} from "@mui/material";
import dealers from "../data/dealers";
import lenders from "../data/lenders";
import employees from "../data/employees";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "92vw", sm: 860 },
  bgcolor: "#1F2023",
  border: "1px solid #33353A",
  boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
  p: 4,
  borderRadius: 3,
  color: "#F5F5F6",
};

const titleStyle = { mb: 1, color: "#F5F5F6", fontWeight: 700 };
const footerStyle = { mt: 3, display: "flex", justifyContent: "flex-end" };
const cancelButtonStyle = {
  mr: 2,
  color: "#C7CAD1",
  borderColor: "#4B5563",
  textTransform: "none",
  fontWeight: 600,
  "&:hover": {
    borderColor: "#EB001B",
    color: "#F5F5F6",
    backgroundColor: "rgba(235,0,27,0.12)",
  },
};
const addButtonStyle = {
  bgcolor: "#EB001B",
  textTransform: "none",
  fontWeight: 700,
  "&:hover": { bgcolor: "#C40018" },
};
const darkInputSx = {
  "& .MuiInputLabel-root": { color: "#A5A7AC" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#F5F5F6" },
  "& .MuiOutlinedInput-root": {
    color: "#F5F5F6",
    "& fieldset": { borderColor: "#3A3B40" },
    "&:hover fieldset": { borderColor: "#EB001B" },
    "&.Mui-focused fieldset": { borderColor: "#EB001B" },
  },
  "& .MuiSvgIcon-root": { color: "#C7CAD1" },
  "& .MuiInputBase-input": {
    color: "#F5F5F6",
    WebkitTextFillColor: "#F5F5F6",
  },
};
const sectionTitleSx = {
  mt: 0,
  mb: 1,
  color: "#D1D5DB",
  fontWeight: 700,
  letterSpacing: 0.2,
  textAlign: "left",
  width: "100%",
};

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
        <Typography variant="body2" sx={{ color: "#A5A7AC", mb: 2 }}>
          Enter deal details and optional financial values.
        </Typography>
        <Divider sx={{ borderColor: "#33353A", mb: 2.5 }} />

        <Typography variant="subtitle2" sx={sectionTitleSx}>
          Deal Information
        </Typography>
        <Divider sx={{ borderColor: "#33353A", mb: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Customer Name"
                  fullWidth
                  required
                  size="small"
                  value={formData.customerName}
                  onChange={handleChange("customerName")}
                  sx={darkInputSx}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Date"
                  type="date"
                  fullWidth
                  required
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={formData.dealDate}
                  onChange={handleChange("dealDate")}
                  sx={darkInputSx}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Autocomplete
                  options={lenderOptions}
                  value={formData.lenderName}
                  onChange={(event, newValue) =>
                    setFormData((prev) => ({ ...prev, lenderName: newValue || "" }))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Lender"
                      fullWidth
                      required
                      size="small"
                      sx={darkInputSx}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={8}>
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
                    <TextField
                      {...params}
                      label="Employee"
                      fullWidth
                      required
                      size="small"
                      sx={darkInputSx}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <Autocomplete
                  options={dealerOptions}
                  value={formData.dealerName}
                  onChange={(event, newValue) =>
                    setFormData((prev) => ({ ...prev, dealerName: newValue || "" }))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Dealer"
                      fullWidth
                      required
                      size="small"
                      sx={darkInputSx}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ ...sectionTitleSx, mt: 1 }}>
              Financial Breakdown
            </Typography>
            <Divider sx={{ borderColor: "#33353A", mb: 2 }} />
            <Grid container spacing={2}>
              {financeFields.map(({ label, key }) => (
                <Grid item xs={12} sm={6} md={4} key={key}>
                  <TextField
                    label={label}
                    type="number"
                    fullWidth
                    value={formData[key]}
                    onChange={handleChange(key)}
                    sx={darkInputSx}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        <Box sx={footerStyle}>
          <Button variant="outlined" onClick={onClose} sx={cancelButtonStyle}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} sx={addButtonStyle}>
            Add Deal
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
