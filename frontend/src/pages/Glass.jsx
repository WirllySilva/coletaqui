import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../styles/pages/Glass.css";
import Footer from "../components/Footer";

const Glass = () => {
  return (
    <div className="glass-banner">
      <header className="custom-header d-flex align-items-center px-3 pt-4">
        <Container>
          <h5>Coleta de Vidro: Guia Completo de Reciclagem</h5>
          
        </Container>
      </header>

      <Container>
        <p className="subtitle">
            A reciclagem de vidro é um processo eficiente que permite reutilizar o material infinitas vezes sem perda de qualidade. Conheça todos os detalhes para fazer a coleta seletiva de vidro corretamente:
          </p>
        <h2 className="section-title">Identificação e Separação</h2>
        <Row>
          <Col lg={8} className="mx-auto">
            <p className="lead">
              Cor da categoria: <strong>VERDE</strong>
            </p>
            <p>
              Todos os tipos de vidro devem ser descartados em lixeiras verdes. O símbolo internacional de reciclagem com o número 70 a 79 identifica materiais de vidro.
            </p>
          </Col>
        </Row>

        <h2 className="section-title">O que pode ser reciclado</h2>
        <Row>
          <Col md={6}>
            <div className="recycle-list">
              <h4>Vidros recicláveis:</h4>
              <ul>
                <li>Garrafas de bebidas (refrigerante, cerveja, vinho)</li>
                <li>Frascos de conservas e molhos</li>
                <li>Potes de alimentos (geleia, requeijão)</li>
                <li>Frascos de perfumes e cosméticos</li>
                <li>Vidros de remédios (sem medicamentos)</li>
                <li>Cacos de vidro comum</li>
              </ul>
            </div>
          </Col>
          <Col md={6}>
            <div className="recycle-list">
              <h4>Vidros não recicláveis:</h4>
              <ul>
                <li>Espelhos e vidros planos (janelas)</li>
                <li>Cristais e porcelanas</li>
                <li>Lâmpadas (precisam de coleta específica)</li>
                <li>Tubos de TV e monitores</li>
                <li>Pirex e vidros temperados</li>
                <li>Vidros de automóveis</li>
                <li>Ampolas de medicamentos</li>
                <li>Cerâmicas, louças e porcelanas</li>
              </ul>
            </div>
          </Col>
        </Row>

        <h2 className="section-title">Como preparar o vidro para reciclagem</h2>
        <div className="steps-container">
          {[
            { id: 1, number: 1, title: "Limpeza básica", text: "Enxágue para remover resíduos de alimentos. Retire rótulos quando possível." },
            { id: 2, number: 2, title: "Cuidados essenciais", text: "Remova tampas e rolhas (metal e plástico). Embale cacos em papel jornal para evitar acidentes." },
            { id: 3, number: 3, title: "Armazenamento seguro", text: "Guarde em recipientes resistentes. Evite misturar com outros materiais." }
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

        <h2 className="section-title">Ciclo de reciclagem do vidro</h2>
        <Row>
          <Col lg={8} className="mx-auto">
            <p>
              O ciclo de reciclagem do vidro envolve coleta, triagem, trituração, limpeza, fusão, modelagem e resfriamento controlado. Cada etapa é crucial para transformar o vidro usado em novos produtos.
            </p>
          </Col>
        </Row>

        <h2 className="section-title">Benefícios da reciclagem de vidro</h2>
        <Row>
          <Col md={6}>
            <div className="benefit-card">
              <i className="bi bi-tree"></i>
              <h4>Ambientais</h4>
              <p>O vidro pode ser reciclado infinitas vezes sem perder qualidade. Economiza recursos naturais e reduz a poluição.</p>
            </div>
          </Col>
          <Col md={6}>
            <div className="benefit-card">
              <i className="bi bi-cash"></i>
              <h4>Econômicos</h4>
              <p>Gera empregos na cadeia de reciclagem e reduz custos de produção industrial.</p>
            </div>
          </Col>
        </Row>
      </Container>

      <div className="footer">
        <Container>
          <p>A reciclagem de vidro representa um ciclo perfeito de sustentabilidade, pois permite que o material seja reaproveitado infinitamente com o mesmo padrão de qualidade.</p>
        </Container>
      </div>
      <Footer/>
    </div>
  );
};

export default Glass;