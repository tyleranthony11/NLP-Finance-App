import React, { useEffect, useState } from "react";
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
    const storedLeads =
      JSON.parse(localStorage.getItem("financeFormDataList")) || [];
    setLeads(storedLeads.reverse());
  }, []);

  const handleConfirm = (index) => {
    const updatedLeads = [...leads];
    updatedLeads[index] = {
      ...updatedLeads[index],
      confirmed: true,
      confirmedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "financeFormDataList",
      JSON.stringify([...updatedLeads].reverse())
    );
    setLeads(updatedLeads);
  };

  const formatDate = (iso) => (iso ? new Date(iso).toLocaleString() : "N/A");

  const newLeads = leads.filter((lead) => !lead.confirmed);
  const followedUpLeads = leads.filter((lead) => lead.confirmed);

  return (
    <Box sx={{ p: 4, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom>
        Leads
      </Typography>

      {newLeads.length > 0 ? (
        <>
          <Typography
            variant="h6"
            sx={{ mt: 3, mb: 2, display: "flex", alignItems: "center", gap: 1 }}
          >
            <FiberNewIcon color="primary" /> New Leads
          </Typography>

          {newLeads.map((lead, index) => (
            <Paper
              key={index}
              sx={{ p: 3, mb: 2, borderRadius: 2, boxShadow: 2 }}
            >
              <Typography variant="h6" gutterBottom>
                {lead.fullName}
              </Typography>
              <Typography>
                <EmailIcon /> {lead.email}
              </Typography>
              <Typography>
                <PhoneIcon /> {lead.phone}
              </Typography>
              <Typography>
                <LocationOnIcon /> {lead.location}
              </Typography>
              <Typography>
                <DirectionsCarIcon /> {lead.vehicle}
              </Typography>
              <Typography>
                <StoreIcon /> {lead.seller}
              </Typography>
              {lead.additionalInfo && (
                <Typography>
                  <NotesIcon /> {lead.additionalInfo}
                </Typography>
              )}
              <Typography>
                <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
                Submitted: {formatDate(lead.submittedAt)}
              </Typography>

              <Button
                variant="contained"
                color="primary"
                onClick={() => handleConfirm(index)}
                sx={{ mt: 2 }}
              >
                Mark as Followed Up
              </Button>
            </Paper>
          ))}
        </>
      ) : (
        <Typography>No new leads at the moment.</Typography>
      )}

      {followedUpLeads.length > 0 && (
        <>
          <Typography
            variant="h6"
            sx={{ mt: 5, mb: 2, display: "flex", alignItems: "center", gap: 1 }}
          >
            <CheckCircleIcon color="success" /> Followed-Up Leads
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "#eee" }}>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Vehicle</TableCell>
                  <TableCell>Seller</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Followed Up</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {followedUpLeads.map((lead, index) => (
                  <TableRow key={index}>
                    <TableCell>{lead.fullName}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.phone}</TableCell>
                    <TableCell>{lead.location}</TableCell>
                    <TableCell>{lead.vehicle}</TableCell>
                    <TableCell>{lead.seller}</TableCell>
                    <TableCell>{formatDate(lead.submittedAt)}</TableCell>
                    <TableCell>
                      <CheckCircleIcon
                        sx={{ verticalAlign: "middle", mr: 1, color: "green" }}
                      />
                      {formatDate(lead.confirmedAt)}
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
