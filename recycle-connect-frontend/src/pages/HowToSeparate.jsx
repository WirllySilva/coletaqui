import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { Container } from "react-bootstrap";
import "../styles/pages/HowToSeparate.css";
import HowToSeparateHeader from "../components/HowToSeparateHeader";
//Buttons images imports
import infoBannerButton from "../assets/info-banner-button.png";
import paperButton from "../assets/paper-button.png";
import glassButton from "../assets/glass-button.png";
import plasticButton from "../assets/plastic-button.png";
import metalButton from "../assets/metal-button.png";
import organicButton from "../assets/organic-button.png";
import batteryButton from "../assets/battery-button.png";

const HowToSeparate = () => {
  return (
    <div className="how-to-separate">
      <Container className="content">

        <HowToSeparateHeader/>

        <div className="recycle-buttons">
          <Link to="/infobanner" className="recycle-button">
            <img src={infoBannerButton} alt="O que precisa saber?"/>
          </Link>
          <Link to="/" className="recycle-button">
            <img src={paperButton} alt="Papel"/>
          </Link>
          <Link to="/" className="recycle-button">
            <img src={glassButton} alt="Vidro"/>
          </Link>
          <Link to="/" className="recycle-button">
            <img src={plasticButton} alt="recycle-button"/>
          </Link>
          <Link to="/" className="recycle-button">
            <img src={organicButton} alt="Orgânico"/>
          </Link>
          <Link to="/" className="recycle-button">
            <img src={metalButton} alt="Metal"/>
          </Link>
          <Link to="/" className="recycle-button">
            <img src={batteryButton} alt="Baterias e Pilhas"/>
          </Link>

        </div>       
      </Container>

      <Footer />
    </div>
  );
};

export default HowToSeparate;
