import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Cursor from "./Cursor";
import "./Navbar.css";

// src/components/Navbar.jsx - Updated links
const LEFT_LINKS = [
  { name: "Projects", path: "/projects" }, // Updated path
  { name: "Services", path: "/services" },
];

const RIGHT_LINKS = [
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

// Split text utility for nav links
const SplitText = ({ text }) => (
  <>
    {text.split("").map((letter, i) => (
      <span
        key={i}
        className="letter-container"
        style={{ ["--delay"]: `${i * 60}ms` }}
      >
        <span className="letter">{letter}</span>
        <span className="letter-clone" aria-hidden>
          {letter}
        </span>
      </span>
    ))}
  </>
);

// Split logo with delay offset between "FLIP" and "STUDIO"
const LogoText = ({ text, baseDelay = 0 }) => (
  <>
    {text.split("").map((letter, i) => (
      <span
        key={i}
        className="brand-letter-container"
        style={{ ["--delay"]: `${baseDelay + i * 70}ms` }}
      >
        <span className="brand-letter">{letter}</span>
        <span className="brand-letter-clone" aria-hidden>
          {letter}
        </span>
      </span>
    ))}
  </>
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <Cursor />
      <header className={`navbar ${scrolled ? "navbar--scrolled" : "navbar--top"}`}>
        <div className="navbar-inner">
          <nav className="nav-section left">
            {LEFT_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? "active" : ""}`}
                onClick={closeMenu}
              >
                <SplitText text={link.name} />
              </Link>
            ))}
          </nav>

          {/* Brand Logo */}
          <Link to="/" className="brand" onClick={closeMenu} aria-label="FlipStudio home">
            <div className="brand-horizontal">
              <div className="brand-flip">
                <LogoText text="FLIP" baseDelay={0} />
              </div>
              <div className="brand-studio">
                <LogoText text="STUDIO" baseDelay={350} />
              </div>
            </div>
          </Link>

          <nav className="nav-section right">
            {RIGHT_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? "active" : ""}`}
                onClick={closeMenu}
              >
                <SplitText text={link.name} />
              </Link>
            ))}
          </nav>

          <button
            className={`hamburger ${menuOpen ? "is-active" : ""}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <div className="hamburger-box">
              <div className="hamburger-inner" />
            </div>
          </button>
        </div>
      </header>

      <div className={`mobile-menu ${menuOpen ? "is-active" : ""}`}>
        <div className="mobile-menu-content">
          <button className="mobile-close" onClick={closeMenu}>✕</button>
          {[...LEFT_LINKS, ...RIGHT_LINKS].map((link) => (
            <Link key={link.name} to={link.path} className="mobile-link" onClick={closeMenu}>
              <SplitText text={link.name} />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
