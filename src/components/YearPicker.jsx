import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import dayjs from "dayjs";

const YearPicker = ({ value, onChange }) => {
  const handlePrevYear = () => {
    onChange(value.subtract(1, "year"));
  };

  const handleNextYear = () => {
    onChange(value.add(1, "year"));
  };

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <IconButton onClick={handlePrevYear}>
        <ArrowBackIosNewIcon fontSize="small" />
      </IconButton>
      <Typography variant="h6">{value.year()}</Typography>
      <IconButton onClick={handleNextYear}>
        <ArrowForwardIosIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default YearPicker;
