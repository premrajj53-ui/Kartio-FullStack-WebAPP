import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <Link to="/" className="footer-logo-link">
            <img src="logo.png" alt="kartio logo" />
            <span>Kartio</span>
          </Link>
          <p>Style, essentials, and everyday finds delivered with care.</p>
        </div>

        <div className="footer-links" aria-label="Footer navigation">
          <ul>
            <li><Link to="/about" className="footer-link">About Us</Link></li>
            <li><Link to="/return-policy" className="footer-link">Return Policy</Link></li>
            <li><Link to="/disclaimer" className="footer-link">Disclaimer</Link></li>
          </ul>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Kartio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
