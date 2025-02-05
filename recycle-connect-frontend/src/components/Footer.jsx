import React from "react";
import { Link } from "react-router-dom";
import homeIcon from "../assets/home-icon.png";
import recycleIcon from "../assets/recycle-icon.png";
import chatIcon from "../assets/chat-icon.png";
import "../styles/components/Footer.css";

const Footer = () => {
  return (
    <footer className="custom-footer">
      <div className="footer-container">
        <Link to="/home" className="home-link">
          <img src={homeIcon} alt="Home" className="footer-icon" />
        </Link>
        <Link to="/recycle" className="recycle-link">
          <img src={recycleIcon} alt="Reciclagem" className="footer-icon" />
        </Link>
        <Link to="/chat" className="chat-link">
          <img src={chatIcon} alt="Chat" className="footer-icon" />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
