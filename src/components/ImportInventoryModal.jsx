import React from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import dealers from "../data/dealers";

const ImportInventoryModal = ({
  open,
  onClose,
  onImport,
  file,
  setFile,
  dealership,
  setDealership,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "92vw", sm: 460 },
          bgcolor: "#1F2023",
          color: "#F5F5F6",
          border: "1px solid #33353A",
          boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
          Import Inventory CSV
        </Typography>
        <Typography variant="body2" sx={{ color: "#A5A7AC", mb: 1 }}>
          Select a dealership, then choose your CSV file to import listings.
        </Typography>

        <TextField
          select
          label="Dealership"
          fullWidth
          margin="normal"
          value={dealership}
          onChange={(e) => setDealership(e.target.value)}
          sx={{
            "& .MuiInputLabel-root": { color: "#A5A7AC" },
            "& .MuiInputLabel-root.Mui-focused": { color: "#F5F5F6" },
            "& .MuiOutlinedInput-root": {
              color: "#F5F5F6",
              "& fieldset": { borderColor: "#3A3B40" },
              "&:hover fieldset": { borderColor: "#EB001B" },
              "&.Mui-focused fieldset": { borderColor: "#EB001B" },
            },
            "& .MuiSvgIcon-root": { color: "#C7CAD1" },
          }}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                sx: {
                  bgcolor: "#1F2023",
                  color: "#F5F5F6",
                  border: "1px solid #2B2B2F",
                },
              },
            },
          }}
        >
          {Object.keys(dealers).map((dealer) => (
            <MenuItem key={dealer} value={dealer}>
              {dealer}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{
            mt: 2,
            borderColor: "#4B5563",
            color: "#D1D5DB",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              borderColor: "#EB001B",
              color: "#F5F5F6",
              backgroundColor: "rgba(235,0,27,0.12)",
            },
          }}
        >
          Select CSV File
          <input
            type="file"
            accept=".csv"
            hidden
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </Button>

        {file && (
          <Typography sx={{ mt: 1, color: "#C7CAD1" }} variant="body2">
            Selected: {file.name}
          </Typography>
        )}

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              borderColor: "#4B5563",
              color: "#D1D5DB",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                borderColor: "#EB001B",
                color: "#F5F5F6",
                backgroundColor: "rgba(235,0,27,0.12)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!file || !dealership}
            onClick={onImport}
            sx={{
              bgcolor: "#EB001B",
              textTransform: "none",
              fontWeight: 700,
              "&:hover": { bgcolor: "#C40018" },
              "&.Mui-disabled": {
                bgcolor: "#3A3B40",
                color: "#8F939C",
              },
            }}
          >
            Import
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ImportInventoryModal;
