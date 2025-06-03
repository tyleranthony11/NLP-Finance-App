import React from "react";
import { Link } from "react-router-dom";
import { FaPencilAlt, FaUser } from "react-icons/fa"; 
import "./TopNav.css";

function TopNav() {
    return (
        <div className="top-nav">
            <div className="top-nav-content">
                <Link to="/PostAdForm" className="top-nav-link">
                    <FaPencilAlt className="top-nav-icon" />
                    Post an Ad
                </Link>
                <div className="top-nav-separator" />
                <Link to="/login" className="top-nav-link">
                    <FaUser className="top-nav-icon" />
                    Login
                </Link>
            </div>
        </div>
    );
}

export default TopNav;
