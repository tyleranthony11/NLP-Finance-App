import React from "react";
import {
  Box,
  Typography,
  Paper,
  FormControlLabel,
  Switch,
  Divider,
} from "@mui/material";

function Settings() {
  return (
    <Box
      sx={{
        p: 3,
        minHeight: "100%",
        bgcolor: "#18191A",
        color: "#F5F5F6",
      }}
    >
      <Box
        sx={{
          mb: 2,
          p: 2,
          borderRadius: 3,
          border: "1px solid #2B2B2F",
          bgcolor: "#1F2023",
        }}
      >
        <Typography variant="h4" sx={{ mb: 0.25, fontWeight: 700 }}>
          Settings
        </Typography>
        <Typography variant="body2" sx={{ color: "#A5A7AC" }}>
          Manage your dashboard preferences.
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: 3,
          border: "1px solid #2B2B2F",
          bgcolor: "#1F2023",
          color: "#F5F5F6",
          maxWidth: 720,
        }}
      >
        <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
          Preferences
        </Typography>
        <Divider sx={{ borderColor: "#33353A", mb: 2 }} />

        <FormControlLabel
          control={
            <Switch
              defaultChecked
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: "#EB001B" },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#EB001B",
                },
              }}
            />
          }
          label="Enable dashboard notifications"
          sx={{ m: 0, "& .MuiFormControlLabel-label": { color: "#D1D5DB" } }}
        />
      </Paper>
    </Box>
  );
}

export default Settings;
