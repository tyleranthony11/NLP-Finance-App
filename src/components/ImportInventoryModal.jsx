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
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Import Inventory CSV
        </Typography>

        <TextField
          select
          label="Dealership"
          fullWidth
          margin="normal"
          value={dealership}
          onChange={(e) => setDealership(e.target.value)}
        >
          {Object.keys(dealers).map((dealer) => (
            <MenuItem key={dealer} value={dealer}>
              {dealer}
            </MenuItem>
          ))}
        </TextField>

        <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
          Select CSV File
          <input
            type="file"
            accept=".csv"
            hidden
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </Button>

        {file && (
          <Typography sx={{ mt: 1 }} variant="body2">
            Selected: {file.name}
          </Typography>
        )}

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!file || !dealership}
            onClick={onImport}
          >
            Import
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ImportInventoryModal;
