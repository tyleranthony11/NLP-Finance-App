import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Footer from './components/footer';

function App() {
  return (
    <Router>
      <Navbar />
      <main style={{ paddingTop: '40px' }}> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/finance" element={<h2 style={{ padding: '2rem' }}>Finance</h2>} />
          <Route path="/marketplace" element={<h2 style={{ padding: '2rem' }}>Marketplace</h2>} />
          <Route path="/dealers" element={<h2 style={{ padding: '2rem' }}>Dealers</h2>} />
          <Route path="/about" element={<h2 style={{ padding: '2rem' }}>About Us</h2>} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
