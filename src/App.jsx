import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

import ClientLayout from './layouts/ClientLayout';

import Home from './pages/Home';
import Finance from './pages/Finance';
import Marketplace from './pages/Marketplace';
import MarketplaceDetail from './pages/MarketplaceDetail';
import Dealers from './pages/Dealers';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import PostAdForm from './pages/PostAdForm';
import Dashboard from './pages/Dashboard';


function App() {
    useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
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
            path="/PostAdForm"
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

          <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
