import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import ClientLayout from "./layouts/ClientLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Client pages
import Home from "./pages/Home";
import Finance from "./pages/Finance";
import Marketplace from "./pages/Marketplace";
import MarketplaceDetail from "./pages/MarketplaceDetail";
import Dealers from "./pages/Dealers";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import PostAdForm from "./pages/PostAdForm";

// Dashboard pages
import DashboardHome from "./pages/dashboard/DashboardHome";
import Leads from "./pages/dashboard/Leads";
import Inventory from "./pages/dashboard/Inventory";
import PendingListings from "./pages/dashboard/PendingListings";
import PostAd from "./pages/dashboard/PostAd";
import FundedDeals from "./pages/dashboard/FundedDeals";
import IncomeReports from "./pages/dashboard/IncomeReports";
import Settings from "./pages/dashboard/Settings";

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    const today = new Date().toISOString().split("T")[0];
    const storedVisits = JSON.parse(localStorage.getItem("visits") || "{}");
    storedVisits[today] = (storedVisits[today] || 0) + 1;
    localStorage.setItem("visits", JSON.stringify(storedVisits));
  }, []);

  return (
    <div className="app-container">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ClientLayout>
                <Home />
              </ClientLayout>
            }
          />
          <Route
            path="/finance"
            element={
              <ClientLayout>
                <Finance />
              </ClientLayout>
            }
          />
          <Route
            path="/marketplace"
            element={
              <ClientLayout>
                <Marketplace />
              </ClientLayout>
            }
          />
          <Route
            path="/marketplace/:id"
            element={
              <ClientLayout>
                <MarketplaceDetail />
              </ClientLayout>
            }
          />
          <Route
            path="/postadform"
            element={
              <ClientLayout>
                <PostAdForm />
              </ClientLayout>
            }
          />
          <Route
            path="/dealers"
            element={
              <ClientLayout>
                <Dealers />
              </ClientLayout>
            }
          />
          <Route
            path="/about"
            element={
              <ClientLayout>
                <About />
              </ClientLayout>
            }
          />
          <Route
            path="/privacy"
            element={
              <ClientLayout>
                <Privacy />
              </ClientLayout>
            }
          />
          <Route
            path="/terms"
            element={
              <ClientLayout>
                <Terms />
              </ClientLayout>
            }
          />

          <Route
            path="/dashboard"
            element={
              <DashboardLayout>
                <DashboardHome />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/leads"
            element={
              <DashboardLayout>
                <Leads />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/inventory"
            element={
              <DashboardLayout>
                <Inventory />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/pending-listings"
            element={
              <DashboardLayout>
                <PendingListings />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/post-ad"
            element={
              <DashboardLayout>
                <PostAd />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/funded-deals"
            element={
              <DashboardLayout>
                <FundedDeals />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/income-reports"
            element={
              <DashboardLayout>
                <IncomeReports />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
