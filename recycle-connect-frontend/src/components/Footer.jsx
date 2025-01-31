import React from "react";
import { FaHome, FaMap, FaBars } from "react-icons/fa";

const Footer = () => {
  return (
    <nav className="footer-nav bg-white py-2 d-flex justify-content-around fixed-bottom">
      <FaHome size={24} />
      <FaMap size={24} />
      <FaBars size={24} />
    </nav>
  );
};

export default Footer;
