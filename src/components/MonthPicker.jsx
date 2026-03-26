import React from "react";
import { Box, IconButton } from "@mui/material";
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
        <IconButton onClick={handlePrev} sx={{ color: "#F5F5F5" }}>
          <ChevronLeftIcon />
        </IconButton>

        <DatePicker
          views={["year", "month"]}
          label="Select Month"
          value={value}
          onChange={onChange}
          sx={{
            "& .MuiPickersInputBase-root": {
              color: "#D1D5DB !important",
            },
            "& .MuiPickersSectionList-root": {
              color: "#D1D5DB !important",
            },
            "& .MuiPickersSectionList-section, & .MuiPickersSectionList-sectionContent":
              {
                color: "#D1D5DB !important",
                WebkitTextFillColor: "#D1D5DB !important",
              },
          }}
          slotProps={{
            textField: {
              size: "small",
              InputLabelProps: {
                sx: {
                  color: "#EB001B !important",
                  "&.Mui-focused": { color: "#EB001B !important" },
                },
              },
              inputProps: {
                style: {
                  color: "#D1D5DB",
                  WebkitTextFillColor: "#D1D5DB",
                },
              },
              sx: {
                minWidth: 170,
                "& .MuiFormLabel-root": { color: "#EB001B !important" },
                "& .MuiInputLabel-root": { color: "#EB001B !important" },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#EB001B !important",
                },
                "& .MuiOutlinedInput-root": {
                  color: "#D1D5DB !important",
                  "& fieldset": { borderColor: "#4B5563" },
                  "&:hover fieldset": { borderColor: "#EB001B" },
                  "&.Mui-focused fieldset": { borderColor: "#EB001B" },
                },
                "& .MuiInputBase-input, & .MuiInputBase-root input, & input": {
                  color: "#D1D5DB !important",
                  WebkitTextFillColor: "#D1D5DB !important",
                  opacity: "1 !important",
                },
                "& .MuiSvgIcon-root": { color: "#F5F5F5 !important" },
              },
            },
          }}
        />

        <IconButton onClick={handleNext} sx={{ color: "#F5F5F5" }}>
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </LocalizationProvider>
  );
};

export default MonthPicker;
