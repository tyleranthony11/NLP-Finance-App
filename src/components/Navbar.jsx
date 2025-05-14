import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo-link">
          <img src="/images/nlplogo.png" alt="Company Logo" className="logo" />
        </Link>
        <ul className="navbar-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/finance">Finance</Link>
          </li>
          <li>
            <Link to="/marketplace">Marketplace</Link>
          </li>
          
          <li>
            <Link to="/dealers">Dealers</Link>
          </li>
          <li>
            <Link to="/about">About Us</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
