import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<h2 style={{ padding: '2rem' }}>Home Page</h2>} />
        <Route path="/vehicles" element={<h2 style={{ padding: '2rem' }}>Browse Vehicles</h2>} />
        <Route path="/finance" element={<h2 style={{ padding: '2rem' }}>Finance</h2>} />
        <Route path="/dealers" element={<h2 style={{ padding: '2rem' }}>Dealers</h2>} />
        <Route path="/about" element={<h2 style={{ padding: '2rem' }}>About Us</h2>} />
      </Routes>
    </Router>
  );
}

export default App;

