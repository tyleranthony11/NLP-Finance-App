import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Store";
import PendingIcon from "@mui/icons-material/HourglassEmpty";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import StatCard from "../../components/StatCard";

const DashboardHome = () => {
  const [activeListings, setActiveListings] = useState(0);
  const [pendingListings, setPendingListings] = useState(0);
  const [newLeads, setNewLeads] = useState(0);

  useEffect(() => {
    const listings = JSON.parse(localStorage.getItem("listings")) || [];

    const active = listings.filter((listing) => listing.status === "active");
    setActiveListings(active.length);

    const pending = listings.filter((listing) => listing.status === "pending");
    setPendingListings(pending.length);

    const leads = JSON.parse(localStorage.getItem("financeFormDataList")) || [];
    setNewLeads(leads.filter((lead) => !lead.confirmed).length);
  }, []);

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
        icon={<PendingIcon sx={{ fontSize: 40, color: "#ff9800" }} />}
        label="Pending Listings"
        value={pendingListings}
      />
      <StatCard
        icon={<FiberNewIcon sx={{ fontSize: 40, color: "#4caf50" }} />}
        label="New Leads"
        value={newLeads}
      />
    </Box>
  );
};

export default DashboardHome;
