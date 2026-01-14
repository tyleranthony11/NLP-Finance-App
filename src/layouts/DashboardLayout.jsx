import React from "react";
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
  Collapse,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Home as HomeIcon,
  Storefront as StorefrontIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  HourglassEmpty as HourglassEmptyIcon,
  AddBox as AddBoxIcon,
  ContactPhone as ContactPhoneIcon,
  AttachMoney as AttachMoneyIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import LogoutIcon from "@mui/icons-material/Logout";

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

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenus, setOpenMenus] = React.useState({});

  const handleToggle = (text) => {
    setOpenMenus((prev) => ({ ...prev, [text]: !prev[text] }));
  };

  const { instance } = useMsal();

  const handleLogout = async () => {
    try {
      await instance.logoutPopup();
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
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
        <Box
          className="dashboard-nav"
          sx={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
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

          <Box sx={{ mt: "auto" }}>
            <List>
              <ListItemButton
                onClick={handleLogout}
                className="dashboard-nav-item"
              >
                <ListItemIcon className="dashboard-nav-icon">
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </List>
          </Box>
        </Box>
      </Drawer>

      <Box component="main" className="dashboard-main">
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
