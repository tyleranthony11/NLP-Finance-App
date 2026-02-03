import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PendingIcon from "@mui/icons-material/HourglassEmpty";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import HandshakeIcon from "@mui/icons-material/Handshake";
import StatCard from "../../components/StatCard";
import TrafficChart from "../../components/TrafficChart";
import dayjs from "dayjs";

const DashboardHome = () => {
  const [activeListings, setActiveListings] = useState(0);
  const [pendingListings, setPendingListings] = useState(0);
  const [newLeads, setNewLeads] = useState(0);
  const [currentMonthDealsCount, setCurrentMonthDealsCount] = useState(0);

  const currentMonth = dayjs().format("MMMM");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const listingsRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/marketplace/admin`,
        );
        const listingsJson = await listingsRes.json();

        if (listingsJson.success) {
          const listings = listingsJson.data || [];
          setActiveListings(
            listings.filter((l) => l.status === "active").length,
          );
          setPendingListings(
            listings.filter((l) => l.status === "pending").length,
          );
        }

        const leadsRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/leads`,
        );
        const leadsJson = await leadsRes.json();

        if (leadsJson.success) {
          const leads = leadsJson.data || [];
          setNewLeads(leads.filter((lead) => !lead.confirmed).length);
        }

        const dealsRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/funded-deals`,
        );
        const dealsJson = await dealsRes.json();

        if (dealsJson.success) {
          const now = dayjs();
          const currentMonthDeals = (dealsJson.data || []).filter((deal) =>
            dayjs(deal.dealDate).isSame(now, "month"),
          );

          setCurrentMonthDealsCount(currentMonthDeals.length);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
        mb: 4,
        marginLeft: 25,
      }}
    >
      <Link to="/dashboard/pending-listings" style={{ textDecoration: "none" }}>
        <StatCard
          icon={<PendingIcon sx={{ fontSize: 40, color: "#ff9800" }} />}
          label="Pending Listings"
          value={pendingListings}
        />
      </Link>
      <Link to="/dashboard/leads" style={{ textDecoration: "none" }}>
        <StatCard
          icon={<FiberNewIcon sx={{ fontSize: 40, color: "#4caf50" }} />}
          label="New Leads"
          value={newLeads}
        />
      </Link>
      <Link to="/dashboard/funded-deals" style={{ textDecoration: "none" }}>
        <StatCard
          icon={<HandshakeIcon sx={{ fontSize: 40, color: "#9c27b0" }} />}
          label={`${currentMonth} Deals`}
          value={currentMonthDealsCount}
        />
      </Link>
      <Link to="/dashboard/inventory" style={{ textDecoration: "none" }}>
        <StatCard
          icon={<DirectionsCarIcon sx={{ fontSize: 40, color: "#1976d2" }} />}
          label="Active Listings"
          value={activeListings}
        />
      </Link>
      <Box sx={{ width: 1200, height: 1500, mt: 5 }}>
        <TrafficChart />
      </Box>
    </Box>
  );
};

export default DashboardHome;
