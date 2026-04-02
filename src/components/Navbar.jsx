import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setIsMenuOpen(false);
    };
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/finance", label: "Finance" },
    { to: "/marketplace", label: "Marketplace" },
    { to: "/dealers", label: "Dealers" },
    { to: "/about", label: "About Us" },
  ];

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="navbar-container">
        <Link to="/" className="logo-link" onClick={closeMenu}>
          <img src="/images/nlpm.jpg" alt="Company Logo" className="logo" />
        </Link>

        <ul className={`navbar-links${isMenuOpen ? " open" : ""}`}>
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                onClick={closeMenu}
                className={`nav-link${location.pathname === to ? " active" : ""}`}
              >
                {label}
                <span className="nav-underline" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          <Link to="/finance" className="cta-btn" onClick={closeMenu}>
            Apply Now
          </Link>
          <button
            className={`menu-toggle${isMenuOpen ? " open" : ""}`}
            type="button"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            <span className="menu-toggle-bar" />
            <span className="menu-toggle-bar" />
            <span className="menu-toggle-bar" />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
