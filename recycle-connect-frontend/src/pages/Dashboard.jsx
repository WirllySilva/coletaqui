import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaRecycle, FaUsers, FaTree, FaTrophy } from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Header />

      <Container className="mt-3">
        <Card className="p-3 text-center">
          <h5>Espaço para mapa da cidade, apenas da cidade de Araçoiaba.</h5>
        </Card>

        <p className="text-center mt-2">Encontre no mapa pontos para deixar seu material reciclável.</p>

        <Row className="text-center">
          <Col xs={3}>
            <FaRecycle size={40} />
            <p>Como separar</p>
          </Col>
          <Col xs={3}>
            <FaUsers size={40} />
            <p>Condutas</p>
          </Col>
          <Col xs={3}>
            <FaTree size={40} />
            <p>Plante uma árvore</p>
          </Col>
          <Col xs={3}>
            <FaTrophy size={40} />
            <p>Ranking</p>
          </Col>
        </Row>

        <h5 className="mt-4 text-success">Dicas de reciclagem</h5>
        <Card className="p-3 text-center mt-2">
          <p>Espaço reservado para dicas de reciclagem</p>
        </Card>
      </Container>

      <Footer />
    </div>
  );
};

export default Dashboard;
