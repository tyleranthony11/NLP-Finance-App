import React from "react";
import { Box, IconButton, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import dayjs from "dayjs";

const MonthPicker = ({ value, onChange }) => {
  const handlePrev = () => {
    onChange(value.subtract(1, "month"));
  };

  const handleNext = () => {
    onChange(value.add(1, "month"));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display="flex" alignItems="center" gap={2}>
        <IconButton onClick={handlePrev}>
          <ChevronLeftIcon />
        </IconButton>

        <DatePicker
          views={["year", "month"]}
          label="Select Month"
          value={value}
          onChange={onChange}
          renderInput={(params) => (
            <TextField {...params} size="small" sx={{ minWidth: 150 }} />
          )}
        />

        <IconButton onClick={handleNext}>
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </LocalizationProvider>
  );
};

export default MonthPicker;
