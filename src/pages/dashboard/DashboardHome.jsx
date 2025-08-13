import React from "react";
import { Box } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Store";
import PendingIcon from "@mui/icons-material/AccessTime";
import LeadsIcon from "@mui/icons-material/PersonAdd";
import DealsIcon from "@mui/icons-material/MonetizationOn";
import StatCard from "../../components/StatCard";

const DashboardHome = ({
  activeListings = 0,
  pendingListings = 0,
  newLeads = 0,
  monthlyFundedDeals = 0,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
        mb: 4,
      }}
    >
      <StatCard
        icon={<InventoryIcon sx={{ fontSize: 40, color: "#1976d2" }} />}
        label="Active Listings"
        value={activeListings}
      />
      <StatCard
        icon={<PendingIcon sx={{ fontSize: 40, color: "#d32f2f" }} />}
        label="Pending Listings"
        value={pendingListings}
      />
      <StatCard
        icon={<LeadsIcon sx={{ fontSize: 40, color: "#2e7d32" }} />}
        label="New Leads"
        value={newLeads}
      />
      <StatCard
        icon={<DealsIcon sx={{ fontSize: 40, color: "#7b1fa2" }} />}
        label="Monthly Funded Deals"
        value={monthlyFundedDeals}
      />
    </Box>
  );
};

export default DashboardHome;
