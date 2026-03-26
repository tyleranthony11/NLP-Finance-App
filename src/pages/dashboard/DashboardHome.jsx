import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PendingIcon from "@mui/icons-material/HourglassEmpty";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import HandshakeIcon from "@mui/icons-material/Handshake";
import StatCard from "../../components/StatCard";
import TrafficChart from "../../components/TrafficChart";
import dayjs from "dayjs";
import { authFetch } from "../../auth/authFetch.js";

const DashboardHome = () => {
  const statIconColor = "#EB001B";
  const [activeListings, setActiveListings] = useState(0);
  const [pendingListings, setPendingListings] = useState(0);
  const [newLeads, setNewLeads] = useState(0);
  const [currentMonthDealsCount, setCurrentMonthDealsCount] = useState(0);

  const currentMonth = dayjs().format("MMMM");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const listingsRes = await authFetch(
          `${import.meta.env.VITE_API_URL}/api/marketplace/admin`,
        );
        if (!listingsRes) return;

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

        const leadsRes = await authFetch(
          `${import.meta.env.VITE_API_URL}/api/leads`,
        );
        if (!leadsRes) return;

        const leadsJson = await leadsRes.json();
        if (leadsJson.success) {
          const leads = leadsJson.data || [];

          setNewLeads(leads.filter((lead) => !lead.followedUp).length);
        }

        const dealsRes = await authFetch(
          `${import.meta.env.VITE_API_URL}/api/funded-deals`,
        );
        if (!dealsRes) return;

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
        height: "100%",
        minHeight: 0,
        width: "100%",
        p: 3,
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
        alignContent: "flex-start",
        overflow: "hidden",
        bgcolor: "#18191A",
      }}
    >
      <Box sx={{ width: "100%", mb: 0.5 }}>
        <Typography variant="h4" sx={{ color: "#F8F8F9", fontWeight: 700 }}>
          Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: "#A5A7AC" }}>
          Snapshot of listings, leads, and funded deals.
        </Typography>
      </Box>

      <Box sx={{ width: "fit-content", maxWidth: "100%" }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Link to="/dashboard/pending-listings" style={{ textDecoration: "none" }}>
            <StatCard
              icon={<PendingIcon sx={{ fontSize: 40, color: statIconColor }} />}
              label="Pending Listings"
              value={pendingListings}
            />
          </Link>
          <Link to="/dashboard/leads" style={{ textDecoration: "none" }}>
            <StatCard
              icon={<FiberNewIcon sx={{ fontSize: 40, color: statIconColor }} />}
              label="New Leads"
              value={newLeads}
            />
          </Link>
          <Link to="/dashboard/funded-deals" style={{ textDecoration: "none" }}>
            <StatCard
              icon={<HandshakeIcon sx={{ fontSize: 40, color: statIconColor }} />}
              label={`${currentMonth} Deals`}
              value={currentMonthDealsCount}
            />
          </Link>
          <Link to="/dashboard/inventory" style={{ textDecoration: "none" }}>
            <StatCard
              icon={<DirectionsCarIcon sx={{ fontSize: 40, color: statIconColor }} />}
              label="Active Listings"
              value={activeListings}
            />
          </Link>
        </Box>

        <Box
          sx={{
            width: "100%",
            height: 1500,
            mt: 5,
            p: 2,
            borderRadius: 3,
            border: "1px solid #2B2B2F",
            bgcolor: "#1F2023",
            overflow: "hidden",
          }}
        >
          <TrafficChart />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardHome;
