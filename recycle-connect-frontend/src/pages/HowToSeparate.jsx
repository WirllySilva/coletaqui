import React from "react";
import Footer from "../components/Footer";
import { Container } from "react-bootstrap";
import "../styles/pages/HowToSeparate.css";

const HowToSeparate = () => {
  return (
    <div className="how-to-separate">
      <Container className="content">
        <h2>Como Separar Materiais Recicláveis</h2>
        <p>Aprenda a separar corretamente os materiais recicláveis para facilitar a reciclagem e contribuir com o meio ambiente.</p>
        <ul>
          <li>Separe materiais recicláveis dos resíduos orgânicos.</li>
          <li>Lave embalagens antes de descartá-las.</li>
          <li>Identifique os tipos de plástico e descarte corretamente.</li>
        </ul>
      </Container>
      <Footer />
    </div>
  );
};

export default HowToSeparate;
