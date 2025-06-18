import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal";
import { FaPencilAlt, FaUser } from "react-icons/fa";
import "./TopNav.css";

function TopNav() {
  const [openLogin, setOpenLogin] = useState(false);

  return (
    <div className="top-nav">
      <div className="top-nav-content">
        <Link to="/PostAdForm" className="top-nav-link">
          <FaPencilAlt className="top-nav-icon" />
          Post an Ad
        </Link>

        <div className="top-nav-separator" />

        <button
          className="login-link"
          onClick={() => setOpenLogin(true)}
          type="button"
        >
          <FaUser className="top-nav-icon" />
          Login
        </button>
      </div>

      <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />
    </div>
  );
}

export default TopNav;
