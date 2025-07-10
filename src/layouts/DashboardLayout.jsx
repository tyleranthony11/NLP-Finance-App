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
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Collapse } from "@mui/material";
import DashboardHome from "../pages/dashboard/DashboardHome";
import Inventory from "../pages/dashboard/Inventory";
import PendingListings from "../pages/dashboard/PendingListings";
import PostAd from "../pages/dashboard/PostAd";
import FundedDeals from "../pages/dashboard/FundedDeals";
import IncomeReports from "../pages/dashboard/IncomeReports";
import "./DashboardLayout.css";

const logoUrl = "/images/nlplogo1.png";

const navItems = [
  {
    text: "Dashboard",
    icon: <HomeIcon />,
    route: "/dashboard",
  },
  {
    text: "Leads",
    icon: <ContactPhoneIcon />,
    route: "/dashboard/leads",
  },
  {
    text: "Marketplace",
    icon: <StorefrontIcon />,
    children: [
      {
        text: "Inventory",
        icon: <CheckCircleOutlineIcon />,
        route: "/dashboard/inventory",
      },
      {
        text: "Pending Listings",
        icon: <HourglassEmptyIcon />,
        route: "/dashboard/pending-listings",
      },
      {
        text: "Post New Ad",
        icon: <AddBoxIcon />,
        route: "/dashboard/post-ad",
      },
    ],
  },
  {
    text: "Funded Deals",
    icon: <AttachMoneyIcon />,
    route: "/dashboard/funded-deals",
  },
  {
    text: "Income Reports",
    icon: <BarChartIcon />,
    route: "/dashboard/income-reports",
  },
  {
    text: "Settings",
    icon: <SettingsIcon />,
    route: "/dashboard/settings",
  },
];
const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenus, setOpenMenus] = React.useState({});
  const handleToggle = (text) => {
    setOpenMenus((prev) => ({ ...prev, [text]: !prev[text] }));
  };

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
            {navItems.map(({ text, icon, route, children }) => (
              <React.Fragment key={text}>
                <ListItemButton
                  onClick={() => {
                    if (children) {
                      handleToggle(text);
                    } else {
                      navigate(route);
                    }
                  }}
                  selected={location.pathname === route}
                  className={`dashboard-nav-item ${
                    location.pathname === route ? "active" : ""
                  }`}
                >
                  <ListItemIcon className="dashboard-nav-icon">
                    {icon}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                  {children ? (
                    openMenus[text] ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )
                  ) : null}
                </ListItemButton>

                {children && (
                  <Collapse in={openMenus[text]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {children.map((child) => (
                        <ListItemButton
                          key={child.text}
                          sx={{ pl: 4 }}
                          onClick={() => navigate(child.route)}
                          selected={location.pathname === child.route}
                          className={`dashboard-nav-item ${
                            location.pathname === child.route ? "active" : ""
                          }`}
                        >
                          <ListItemIcon className="dashboard-nav-icon">
                            {child.icon}
                          </ListItemIcon>
                          <ListItemText primary={child.text} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" className="dashboard-main">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="pending-listings" element={<PendingListings />} />
          <Route path="post-ad" element={<PostAd />} />
          <Route path="funded-deals" element={<FundedDeals />} />
          <Route path="income-reports" element={<IncomeReports />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
