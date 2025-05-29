import React, {useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Finance from './pages/Finance';
import Marketplace from './pages/Marketplace';
import MarketplaceDetail from './pages/MarketplaceDetail';
import Dealers from './pages/Dealers';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Footer from './components/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';
import PostAdForm from './pages/PostAdForm';

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
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/marketplace/:id" element={<MarketplaceDetail />} />
            <Route path="/PostAdForm" element={<PostAdForm />} />
            <Route path="/dealers" element={<Dealers />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
