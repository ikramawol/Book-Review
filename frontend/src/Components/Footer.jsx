import React from "react";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <h2>BookReview</h2>
          <p>Your next favorite book awaits.</p>
        </div>

        {/* <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/featured">Featured</a></li>
            <li><a href="/categories">Categories</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </div> */}

        <div className="footer-socials">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} BookReview. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
