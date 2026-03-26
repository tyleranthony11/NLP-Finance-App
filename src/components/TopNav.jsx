import React from "react";
import { Link } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";
import "./TopNav.css";

function TopNav() {
  return (
    <div className="top-nav">
      <div className="top-nav-content">
        <Link to="/PostAdForm" className="top-nav-link">
          <FaPencilAlt className="top-nav-icon" />
          Post an Ad
        </Link>
      </div>
    </div>
  );
}

export default TopNav;
