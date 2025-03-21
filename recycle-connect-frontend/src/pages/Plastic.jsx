import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../styles/pages/Plastic.css";

const Plastic = () => {
  return (
    <div className="plastic-banner">
      <div className="hero-section">
        <Container>
          <h1>Coleta de Plástico: Guia Completo de Reciclagem</h1>
          <p className="subtitle">
            O plástico é um dos materiais mais abundantes em nosso cotidiano e sua reciclagem adequada é essencial para reduzir o impacto ambiental. Confira como fazer a coleta seletiva de plásticos corretamente:
          </p>
        </Container>
      </div>

      <Container>
        <h2 className="section-title">Identificação e Separação</h2>
        <Row>
          <Col lg={8} className="mx-auto">
            <p className="lead">
              Cor da categoria: <strong>VERMELHO</strong>
            </p>
            <p>
              Todos os tipos de plástico devem ser descartados em lixeiras vermelhas. Os plásticos são identificados pelos símbolos de 1 a 7 dentro do triângulo de reciclagem.
            </p>
          </Col>
        </Row>

        <h2 className="section-title">Tipos de plásticos recicláveis</h2>
        <Row>
          <Col md={6}>
            <div className="recycle-list">
              <h4>1 - PET (Polietileno Tereftalato):</h4>
              <ul>
                <li>Garrafas de refrigerante, água e óleo</li>
                <li>Embalagens de produtos de limpeza</li>
                <li>Bandejas de microondas</li>
              </ul>
            </div>
          </Col>
          <Col md={6}>
            <div className="recycle-list">
              <h4>2 - PEAD (Polietileno de Alta Densidade):</h4>
              <ul>
                <li>Frascos de shampoo e cosméticos</li>
                <li>Garrafas de leite e sucos</li>
                <li>Embalagens de produtos de limpeza</li>
              </ul>
            </div>
          </Col>
        </Row>

        <h2 className="section-title">Como preparar o plástico para reciclagem</h2>
        <div className="steps-container">
          {[
            { id: 1, number: 1, title: "Limpeza básica", text: "Enxágue para remover resíduos de alimentos. Retire rótulos de papel quando possível." },
            { id: 2, number: 2, title: "Compactação", text: "Amasse garrafas e frascos para reduzir volume. Empilhe potes do mesmo tipo quando possível." },
            { id: 3, number: 3, title: "Separação por tipo (se possível)", text: "Agrupamento conforme numeração facilita o processo de reciclagem." }
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

        <h2 className="section-title">Ciclo de reciclagem do plástico</h2>
        <Row>
          <Col lg={8} className="mx-auto">
            <p>
              O ciclo de reciclagem do plástico envolve coleta, triagem, lavagem, trituração, aglutinação, extrusão e fabricação. Cada etapa é crucial para transformar o plástico usado em novos produtos.
            </p>
          </Col>
        </Row>

        <h2 className="section-title">Benefícios da reciclagem de plástico</h2>
        <Row>
          <Col md={6}>
            <div className="benefit-card">
              <i className="bi bi-tree"></i>
              <h4>Ambientais</h4>
              <p>Reduz o volume de resíduos em aterros e oceanos. Economiza energia e diminui a extração de recursos não renováveis.</p>
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
          <p>A separação correta dos plásticos para reciclagem é um passo fundamental para combater a poluição causada por este material tão presente em nosso dia a dia.</p>
        </Container>
      </div>
    </div>
  );
};

export default Plastic;