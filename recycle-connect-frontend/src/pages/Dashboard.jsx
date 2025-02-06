import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MapPreview from "../components/MapPreview"; // Importando o novo componente
import { Container, Row, Col, Card } from "react-bootstrap";
import rankingIcon from "../assets/ranking-icon.png";
import collectorsIcon from "../assets/collector-icon.png";
import plantATree from "../assets/plant-a-tree-icon.png";
import recycleBottonicon from "../assets/recyclebotton-icon.png";

import "../styles/pages/DashBoard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Header />

      <Container className="mt-3">
        {/* Novo componente MapPreview para substituir o espaço do mapa */}
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
        
        <h5 className="mt-4 recycling-tips-text">Dicas de reciclagem</h5>
        <Card className="p-3 card-tips mt-2">
          <p>Espaço reservado para dicas de reciclagem</p>
        </Card>
      </Container>

      <Footer />
    </div>
  );
};

export default Dashboard;