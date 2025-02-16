import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MapPreview from "../components/MapPreview";
import RecyclingTips from "../components/RecyclingTips";
import { Container, Row, Col } from "react-bootstrap";
import rankingIcon from "../assets/ranking-icon.png";
import collectorsIcon from "../assets/collector-icon.png";
import plantATree from "../assets/plant-a-tree-icon.png";
import recycleBottonicon from "../assets/recyclebotton-icon.png";
import "../styles/pages/Home.css";

const Home = () => {
  const tipsList = [
    {
      id: 1,
      title: "Como separar materiais recicláveis",
      summary: "Aprenda a separar corretamente os materiais recicláveis.",
      link: "/dica/1", // Link para a página completa
    },
    {
      id: 2,
      title: "Dicas para lavar recipientes",
      summary: "Saiba como lavar recipientes antes de reciclar.",
      link: "/dica/2",
    },
    {
      id: 3,
      title: "Tipos de plásticos",
      summary: "Evite misturar diferentes tipos de plásticos.",
      link: "/dica/3",
    },
    {
      id: 4,
      title: "Doação de objetos reutilizáveis",
      summary: "Descubra como doar objetos em vez de descartá-los.",
      link: "/dica/4",
    },
  ];

  return (
    <div className="dashboard">
      <Header />

      <Container className="mt-3">
        <MapPreview />

        <p className="text-center mt-2">
          Encontre no mapa pontos para deixar seu material reciclável.
        </p>

        <Row className="text-center icon-buttons">
          <Col className="icon-col">
            <img src={recycleBottonicon} alt="Recycle" className="feature-icon" />
            <p>Como separar</p>
          </Col>
          <Col className="icon-col">
            <img src={collectorsIcon} alt="Collectors" className="feature-icon" />
            <p>Catadores</p>
          </Col>
          <Col className="icon-col">
            <img src={plantATree} alt="Plant a tree" className="feature-icon" />
            <p>Plante uma árvore</p>
          </Col>
          <Col className="icon-col">
            <img src={rankingIcon} alt="Ranking" className="feature-icon" />
            <p>Ranking</p>
          </Col>
        </Row>

        {/* Componente de Dicas de Reciclagem recebendo a lista via props */}
        <RecyclingTips tips={tipsList} />
      </Container>

      <Footer />
    </div>
  );
};

export default Home;