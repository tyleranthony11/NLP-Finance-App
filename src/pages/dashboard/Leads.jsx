import React, { useEffect, useState } from "react";
import { authFetch } from "../../auth/authFetch.js";
import "./Leads.css";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import StoreIcon from "@mui/icons-material/Store";
import NotesIcon from "@mui/icons-material/Notes";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FiberNewIcon from "@mui/icons-material/FiberNew";

function Leads() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await authFetch(
          `${import.meta.env.VITE_API_URL}/api/leads`,
        );
        if (!res) return;
        const json = await res.json();

        if (json.success) {
          setLeads(json.data);
        }
      } catch (err) {
        console.error("Failed to load leads", err);
      }
    };

    fetchLeads();
  }, []);

  const handleConfirm = async (lead) => {
    try {
      const res = await authFetch(
        `${import.meta.env.VITE_API_URL}/api/leads/${lead.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            followedUp: true,
            followedUpAt: new Date().toISOString(),
          }),
        },
      );
      if (!res) return;
      const json = await res.json();

      if (json.success) {
        setLeads((prev) => prev.map((l) => (l.id === lead.id ? json.data : l)));
      }
    } catch (err) {
      console.error("Failed to mark as followed up", err);
    }
  };
  const formatDate = (iso) =>
    iso
      ? new Date(iso).toLocaleString(undefined, {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })
      : "N/A";

  const newLeads = leads.filter((lead) => !lead.followedUp);
  const followedUpLeads = leads.filter((lead) => lead.followedUp);

  return (
    <Box
      className="leads-page"
      sx={{
        p: 3,
        pb: 0,
        backgroundColor: "#18191A",
        minHeight: "100%",
        color: "#F5F5F6",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          p: 2,
          borderRadius: 3,
          border: "1px solid #2B2B2F",
          bgcolor: "#1F2023",
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ mb: 0.25, fontWeight: 700 }}>
            Leads
          </Typography>
          <Typography variant="body2" sx={{ color: "#A5A7AC" }}>
            Track new lead submissions and follow-up history.
          </Typography>
        </Box>
      </Box>

      {newLeads.length > 0 ? (
        <>
          <Typography
            variant="h6"
            sx={{
              mt: 2,
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#F8F8F9",
              fontWeight: 700,
            }}
          >
            <FiberNewIcon sx={{ color: "#EB001B" }} /> New Leads
          </Typography>

          {newLeads.map((lead) => (
            <Paper
              key={lead.id}
              sx={{
                p: 3,
                mb: 2,
                borderRadius: 3,
                border: "1px solid #2B2B2F",
                boxShadow: "0 10px 24px rgba(0,0,0,0.3)",
                bgcolor: "#1F2023",
                color: "#F5F5F6",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
                {lead.first_name} {lead.last_name}
              </Typography>

              <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EmailIcon sx={{ color: "#EB001B" }} /> {lead.email}
              </Typography>
              <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PhoneIcon sx={{ color: "#EB001B" }} /> {lead.phone}
              </Typography>
              <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOnIcon sx={{ color: "#EB001B" }} /> {lead.location}
              </Typography>
              <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <DirectionsCarIcon sx={{ color: "#EB001B" }} /> {lead.vehicle}
              </Typography>
              <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <StoreIcon sx={{ color: "#EB001B" }} /> {lead.seller}
              </Typography>

              {lead.additional_info && (
                <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <NotesIcon sx={{ color: "#EB001B" }} /> {lead.additional_info}
                </Typography>
              )}

              <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarTodayIcon fontSize="small" sx={{ color: "#EB001B" }} />
                Submitted: {formatDate(lead.created_at)}
              </Typography>

              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  bgcolor: "#EB001B",
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: 2,
                  "&:hover": { bgcolor: "#C40018" },
                }}
                onClick={() => handleConfirm(lead)}
              >
                Mark as Followed Up
              </Button>
            </Paper>
          ))}
        </>
      ) : (
        <Typography sx={{ color: "#A5A7AC" }}>No new leads at the moment.</Typography>
      )}

      {followedUpLeads.length > 0 && (
        <>
          <Typography
            variant="h6"
            sx={{
              mt: 4,
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#F8F8F9",
              fontWeight: 700,
            }}
          >
            <CheckCircleIcon sx={{ color: "#22C55E" }} /> Followed-Up Leads
          </Typography>

          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 3,
              border: "1px solid #2B2B2F",
              bgcolor: "#1F2023",
              color: "#F5F5F6",
              boxShadow: "0 10px 24px rgba(0,0,0,0.3)",
            }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: "#212327" }}>
                <TableRow>
                  {[
                    "Name",
                    "Email",
                    "Phone",
                    "Location",
                    "Vehicle",
                    "Seller",
                    "Submitted",
                    "Followed Up",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        color: "#F5F5F5",
                        fontWeight: 700,
                        borderBottom: "1px solid #2B2B2F",
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {followedUpLeads.map((lead) => (
                  <TableRow
                    key={lead.id}
                    sx={{
                      "& td": {
                        color: "#E5E7EB",
                        borderBottom: "1px solid #2B2B2F",
                      },
                      "&:hover": { backgroundColor: "#23262B" },
                    }}
                  >
                    <TableCell>
                      {lead.first_name} {lead.last_name}
                    </TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.phone}</TableCell>
                    <TableCell>{lead.location}</TableCell>
                    <TableCell>{lead.vehicle}</TableCell>
                    <TableCell>{lead.seller}</TableCell>
                    <TableCell>{formatDate(lead.created_at)}</TableCell>
                    <TableCell>
                      <CheckCircleIcon
                        sx={{ verticalAlign: "middle", mr: 1, color: "#22C55E" }}
                      />
                      {formatDate(lead.followedUpAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
}

export default Leads;
