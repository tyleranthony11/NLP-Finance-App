import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import ClientLayout from "./layouts/ClientLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardAuth from "./auth/DashboardAuth";

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
              <DashboardAuth>
                <DashboardLayout>
                  <DashboardHome />
                </DashboardLayout>
              </DashboardAuth>
            }
          />
          <Route
            path="/dashboard/leads"
            element={
              <DashboardAuth>
                <DashboardLayout>
                  <Leads />
                </DashboardLayout>
              </DashboardAuth>
            }
          />
          <Route
            path="/dashboard/inventory"
            element={
              <DashboardAuth>
                <DashboardLayout>
                  <Inventory />
                </DashboardLayout>
              </DashboardAuth>
            }
          />
          <Route
            path="/dashboard/pending-listings"
            element={
              <DashboardAuth>
                <DashboardLayout>
                  <PendingListings />
                </DashboardLayout>
              </DashboardAuth>
            }
          />
          <Route
            path="/dashboard/post-ad"
            element={
              <DashboardAuth>
                <DashboardLayout>
                  <PostAd />
                </DashboardLayout>
              </DashboardAuth>
            }
          />
          <Route
            path="/dashboard/funded-deals"
            element={
              <DashboardAuth>
                <DashboardLayout>
                  <FundedDeals />
                </DashboardLayout>
              </DashboardAuth>
            }
          />
          <Route
            path="/dashboard/income-reports"
            element={
              <DashboardAuth>
                <DashboardLayout>
                  <IncomeReports />
                </DashboardLayout>
              </DashboardAuth>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <DashboardAuth>
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              </DashboardAuth>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
