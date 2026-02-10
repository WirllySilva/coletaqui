import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../styles/pages/Metal.css";
import Footer from "../components/Footer"

const Metal = () => {
  return (
    <div className="metal-banner">
      <header className="custom-header d-flex align-items-center px-3 pt-4">
        <Container>
          <h5>Coleta de Metal: Guia Completo de Reciclagem</h5>
        </Container>
      </header>

      <Container>
        <p className="subtitle">
          A reciclagem de metais é um dos processos mais eficientes e economicamente viáveis dentro da cadeia de reciclagem. Confira como fazer a coleta seletiva de metais corretamente:
        </p>
        <h2 className="section-title">Identificação e Separação</h2>
        <Row>
          <Col lg={8} className="mx-auto">
            <p className="lead">
              Cor da categoria: <strong>AMARELO</strong>
            </p>
            <p>
              Todos os tipos de metal devem ser descartados em lixeiras amarelas. Os metais geralmente são identificados pelos símbolos 40 a 49 dentro do triângulo de reciclagem.
            </p>
          </Col>
        </Row>

        <h2 className="section-title">Tipos de metais recicláveis</h2>
        <Row>
          <Col md={6}>
            <div className="recycle-list">
              <h4>Metais ferrosos:</h4>
              <ul>
                <li>Latas de alimentos em conserva</li>
                <li>Tampas metálicas de garrafas</li>
                <li>Panelas e utensílios de cozinha de ferro</li>
                <li>Clipes, grampos e pregos</li>
                <li>Ferramentas de ferro</li>
                <li>Aço em geral</li>
              </ul>
            </div>
          </Col>
          <Col md={6}>
            <div className="recycle-list">
              <h4>Metais não-ferrosos:</h4>
              <ul>
                <li>Latas de alumínio (refrigerantes e cervejas)</li>
                <li>Papel alumínio limpo</li>
                <li>Embalagens metalizadas de alimentos</li>
                <li>Fios e cabos de cobre</li>
                <li>Peças de bronze e latão</li>
                <li>Esquadrias de alumínio</li>
              </ul>
            </div>
          </Col>
        </Row>

        <h2 className="section-title">Como preparar o metal para reciclagem</h2>
        <div className="steps-container">
          {[
            { id: 1, number: 1, title: "Limpeza básica", text: "Enxágue para remover resíduos de alimentos. Retire rótulos de papel quando possível." },
            { id: 2, number: 2, title: "Compactação", text: "Amasse latas para reduzir volume. Separe tampas metálicas dos recipientes de vidro." },
            { id: 3, number: 3, title: "Separação magnética (opcional)", text: "Use um ímã para separar metais ferrosos (que grudam) dos não-ferrosos (que não grudam)." }
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

        <h2 className="section-title">Ciclo de reciclagem do metal</h2>
        <Row>
          <Col lg={8} className="mx-auto">
            <p>
              O ciclo de reciclagem do metal envolve coleta, triagem, limpeza, trituração, fusão, solidificação e fabricação. Cada etapa é crucial para transformar o metal usado em novos produtos.
            </p>
          </Col>
        </Row>

        <h2 className="section-title">Benefícios da reciclagem de metal</h2>
        <Row>
          <Col md={6}>
            <div className="benefit-card">
              <i className="bi bi-tree"></i>
              <h4>Ambientais</h4>
              <p>Reduz a extração de minérios e economiza energia. Diminui a emissão de gases do efeito estufa.</p>
            </div>
          </Col>
          <Col md={6}>
            <div className="benefit-card">
              <i className="bi bi-cash"></i>
              <h4>Econômicos</h4>
              <p>Alto valor no mercado de reciclagem. Gera renda para catadores e cooperativas.</p>
            </div>
          </Col>
        </Row>
      </Container>

      <div className="footer">
        <Container>
          <p>A reciclagem de metais é um exemplo de sucesso na economia circular, combinando benefícios ambientais com vantagens econômicas significativas.</p>
        </Container>
      </div>
      <Footer/>
    </div>
  );
};

export default Metal;