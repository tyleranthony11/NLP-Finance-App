import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AddDealModal from "../../components/AddDealModal";
import "./FundedDeals.css";
import { formatLocalDate } from "../../utils";

const FundedDeals = () => {
  const [openModal, setOpenModal] = useState(false);
  const [deals, setDeals] = useState([]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleAddDeal = (newDeal) => {
    setDeals((prevDeals) => [...prevDeals, newDeal]);
    setOpenModal(false);
  };

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const parseLocalDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day); // month is 0-indexed
  };

  const mtdDeals = deals.filter((deal) => {
    const dealDate = parseLocalDate(deal.date);
    return (
      dealDate.getFullYear() === currentYear &&
      dealDate.getMonth() === currentMonth
    );
  });

  const mtdIncome = mtdDeals.reduce((sum, d) => sum + d.income, 0);

  return (
    <Box className="funded-deals-container">
      <Box className="funded-deals-header">
        <Typography variant="h4">Funded Deals</Typography>
        <Button variant="contained" onClick={handleOpenModal}>
          Add New Deal
        </Button>
      </Box>

      <Box className="funded-deals-summary">
        <Card className="deal-summary-card">
          <CardContent>
            <Box className="deal-summary-content">
              <AssignmentTurnedInIcon className="deal-summary-icon" />
              <Box>
                <Typography variant="subtitle2">MTD Deals</Typography>
                <Typography variant="h6">{mtdDeals.length}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card className="deal-summary-card">
          <CardContent>
            <Box className="deal-summary-content">
              <TrendingUpIcon className="deal-summary-icon" />
              <Box>
                <Typography variant="subtitle2">MTD Income</Typography>
                <Typography variant="h6">
                  ${mtdIncome.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Paper className="funded-deals-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Customer Name</strong>
              </TableCell>
              <TableCell>
                <strong>Date</strong>
              </TableCell>
              <TableCell>
                <strong>Total Income</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deals.map((deal, idx) => (
              <TableRow key={idx}>
                <TableCell>{deal.customer}</TableCell>
                <TableCell>{formatLocalDate(deal.date)}</TableCell>
                <TableCell>${deal.income.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <AddDealModal
        open={openModal}
        onClose={handleCloseModal}
        onAddDeal={handleAddDeal}
      />
    </Box>
  );
};

export default FundedDeals;
