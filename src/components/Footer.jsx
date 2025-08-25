import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms of Service</Link>
      </div>
      <div className="footer-center">
        <p>&copy; 2025 NLP Finance Inc. All rights reserved</p>
      </div>
      <div className="footer-right">
        <a
          href="https://facebook.com/NLPFinance"
          target="_blank"
          rel="nooopener noreferrer"
        >
          <FaFacebookF />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="nooopener noreferrer"
        >
          <FaInstagram />
        </a>
        <a href="https://x.com" target="_blank" rel="nooopener noreferrer">
          <FaTwitter />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
