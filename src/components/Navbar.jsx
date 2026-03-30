import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo-link">
          <img src="/images/nlp.jpg" alt="Company Logo" className="logo" />
        </Link>
        <button
          className="menu-toggle"
          type="button"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span className="menu-toggle-bar" />
          <span className="menu-toggle-bar" />
          <span className="menu-toggle-bar" />
        </button>
        <ul className={`navbar-links ${isMenuOpen ? "open" : ""}`}>
          <li>
            <Link to="/" onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/finance" onClick={closeMenu}>
              Finance
            </Link>
          </li>
          <li>
            <Link to="/marketplace" onClick={closeMenu}>
              Marketplace
            </Link>
          </li>
          <li>
            <Link to="/dealers" onClick={closeMenu}>
              Dealers
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={closeMenu}>
              About Us
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
