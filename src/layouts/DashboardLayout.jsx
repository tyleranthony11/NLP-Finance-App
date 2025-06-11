import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    CssBaseline,
    AppBar,
    Toolbar,
    Typography,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import StorefrontIcon from "@mui/icons-material/Storefront";
import MarketplaceManager from "../pages/dashboard/MarketplaceManager";
import "./DashboardLayout.css";

const logoUrl = "/images/nlplogo1.png";
const drawerWidth = 240;

const navItems = [
    { text: "Home", icon: <HomeIcon />, route: "/dashboard" },
    { text: "Marketplace", icon: <StorefrontIcon />, route: "/dashboard/marketplace" },
];

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box className="dashboard-root">
      <CssBaseline />
      <AppBar position="fixed" className="dashboard-appbar">
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Employee Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" className="dashboard-drawer">
        <Toolbar className="dashboard-logo">
          <img src={logoUrl} alt="Company Logo" />
        </Toolbar>
        <Box className="dashboard-nav">
          <List>
            {navItems.map(({ text, icon, route }) => (
              <ListItemButton
                key={text}
                selected={location.pathname === route}
                onClick={() => navigate(route)}
                className={`dashboard-nav-item ${
                  location.pathname === route ? "active" : ""
                }`}
              >
                <ListItemIcon className="dashboard-nav-icon">{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" className="dashboard-main">
        <Routes>
          <Route path="marketplace" element={<MarketplaceManager />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default DashboardLayout;