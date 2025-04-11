import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../styles/pages/Battery.css";
import Footer from "../components/Footer";

const Battery = () => {
  return (
    <div className="battery-banner">
      <header className="custom-header d-flex align-items-center px-3 pt-4">
        <Container>
          <h5>Coleta de Baterias e Pilhas: Guia Completo de Descarte</h5>
        </Container>
      </header>

      <Container>
        <p className="subtitle">
          Baterias e pilhas contêm substâncias tóxicas e metais pesados que podem contaminar o meio ambiente quando descartados incorretamente. Veja como fazer o descarte adequado desses materiais:
        </p>
        <h2 className="section-title">Identificação e Separação</h2>
        <Row>
          <Col lg={8} className="mx-auto">
            <p className="lead">
              Cor da categoria: <strong>LARANJA</strong> (em alguns sistemas)
            </p>
            <p>
              Baterias e pilhas exigem coleta específica, não devendo ser misturadas com outros materiais. Procure pelo símbolo de "proibido descarte no lixo comum" nas embalagens.
            </p>
          </Col>
        </Row>

        <h2 className="section-title">Tipos de baterias e pilhas</h2>
        <Row>
          <Col md={6}>
            <div className="recycle-list">
              <h4>Pilhas comuns:</h4>
              <ul>
                <li>Pilhas alcalinas (AA, AAA, C, D)</li>
                <li>Pilhas de zinco-carbono</li>
                <li>Pilhas recarregáveis de NiMH e NiCd</li>
                <li>Pilhas botão (relógios, calculadoras)</li>
              </ul>
            </div>
          </Col>
          <Col md={6}>
            <div className="recycle-list">
              <h4>Baterias:</h4>
              <ul>
                <li>Baterias de celulares e smartphones</li>
                <li>Baterias de notebooks e tablets</li>
                <li>Baterias de câmeras digitais</li>
                <li>Baterias de carros, motos e outros veículos</li>
                <li>Baterias de no-breaks e sistemas de energia</li>
              </ul>
            </div>
          </Col>
        </Row>

        <h2 className="section-title">Como preparar pilhas e baterias para o descarte</h2>
        <div className="steps-container">
          {[
            { id: 1, number: 1, title: "Isolamento", text: "Coloque fita isolante nos terminais das baterias de lítio para evitar curto-circuito." },
            { id: 2, number: 2, title: "Armazenamento temporário", text: "Guarde em recipientes secos, preferencialmente plásticos. Não misture com outros tipos de resíduos." },
            { id: 3, number: 3, title: "Integridade física", text: "Nunca perfure, quebre ou desmonte pilhas e baterias. Evite contato com água ou umidade excessiva." }
          ].map((step) => (
            <div key={step.id} className="step d-flex">
              <div className="step-number">{step.number}</div>
              <div className="step-content">
                <h4>{step.title}</h4>
                <p>{step.text}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="section-title">Processo de reciclagem de pilhas e baterias</h2>
        <Row>
          <Col lg={8} className="mx-auto">
            <p>
              O processo de reciclagem envolve coleta, triagem, processamento mecânico, térmico e químico, neutralização e recuperação de materiais. Cada etapa é crucial para garantir a segurança e eficiência do processo.
            </p>
          </Col>
        </Row>

        <h2 className="section-title">Benefícios do descarte correto</h2>
        <Row>
          <Col md={6}>
            <div className="benefit-card">
              <i className="bi bi-tree"></i>
              <h4>Ambientais</h4>
              <p>Evita a contaminação do solo, lençóis freáticos e cursos d'água. Previne bioacumulação de metais pesados.</p>
            </div>
          </Col>
          <Col md={6}>
            <div className="benefit-card">
              <i className="bi bi-cash"></i>
              <h4>Econômicos</h4>
              <p>Recuperação de metais valiosos e desenvolvimento da indústria de reciclagem especializada.</p>
            </div>
          </Col>
        </Row>
      </Container>

      <div className="footer">
        <Container>
          <p>O descarte correto de pilhas e baterias é uma responsabilidade compartilhada entre consumidores, comerciantes e fabricantes.</p>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default Battery;