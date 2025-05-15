import React, {useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Finance from './pages/Finance';
import Dealers from './pages/Dealers';
import Footer from './components/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';

function App() {
    useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  return (
    <Router>
      <Navbar />
      <main style={{ paddingTop: '40px' }}> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/marketplace" element={<h2 style={{ padding: '2rem' }}>Marketplace</h2>} />
          <Route path="/dealers" element={<Dealers />}/>
          <Route path="/about" element={<h2 style={{ padding: '2rem' }}>About Us</h2>} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
