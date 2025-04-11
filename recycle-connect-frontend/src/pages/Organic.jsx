import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../styles/pages/Organic.css";
import Footer from "../components/Footer";

const Organic = () => {
  return (
    <div className="organic-banner">
      <header className="custom-header d-flex align-items-center px-3 pt-4">
        <Container>
          <h5>Coleta de Resíduos Orgânicos: Guia Completo</h5>         
        </Container>
      </header>

      <Container>
      <p className="subtitle">
            Os resíduos orgânicos representam mais de 50% do lixo doméstico brasileiro e seu tratamento adequado é essencial para reduzir o impacto ambiental. Veja como fazer a coleta seletiva de resíduos orgânicos corretamente:
          </p>
        <h2 className="section-title">Identificação e Separação</h2>
        <Row>
          <Col lg={8} className="mx-auto">
            <p className="lead">
              Cor da categoria: <strong>MARROM</strong>
            </p>
            <p>
              Todos os resíduos orgânicos devem ser descartados em lixeiras marrons. Em algumas localidades, utiliza-se o símbolo de compostagem para identificar os coletores.
            </p>
          </Col>
        </Row>

        <h2 className="section-title">O que é considerado resíduo orgânico</h2>
        <Row>
          <Col md={6}>
            <div className="recycle-list">
              <h4>Resíduos orgânicos compostáveis:</h4>
              <ul>
                <li>Restos de frutas, legumes e verduras</li>
                <li>Cascas de ovos</li>
                <li>Borra e filtro de café</li>
                <li>Sachês de chá</li>
                <li>Restos de alimentos cozidos sem molhos</li>
                <li>Folhas secas e podas de jardim</li>
                <li>Palitos de madeira</li>
                <li>Guardanapos e papel-toalha sem produtos químicos</li>
                <li>Serragem não tratada</li>
              </ul>
            </div>
          </Col>
          <Col md={6}>
            <div className="recycle-list">
              <h4>Resíduos orgânicos não recomendados:</h4>
              <ul>
                <li>Carnes, laticínios e derivados</li>
                <li>Alimentos muito gordurosos</li>
                <li>Fezes de animais domésticos</li>
                <li>Plantas doentes</li>
                <li>Madeira tratada com produtos químicos</li>
                <li>Papel higiênico usado</li>
                <li>Cinzas de churrasqueira</li>
              </ul>
            </div>
          </Col>
        </Row>

        <h2 className="section-title">Como separar resíduos orgânicos</h2>
        <div className="steps-container">
          {[
            { id: 1, number: 1, title: "Recipiente adequado", text: "Use recipientes com tampa para evitar odores e insetos. Prefira baldes ou composteiras específicas." },
            { id: 2, number: 2, title: "Preparação dos resíduos", text: "Corte em pedaços menores para acelerar a decomposição. Escorra o excesso de líquidos antes de descartar." },
            { id: 3, number: 3, title: "Frequência de descarte", text: "Não acumule por mais de 3-4 dias. Em climas quentes, faça o descarte diariamente." }
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

        <h2 className="section-title">Métodos de tratamento de resíduos orgânicos</h2>
        <Row>
          <Col lg={8} className="mx-auto">
            <p>
              Os métodos de tratamento incluem compostagem doméstica, vermicompostagem e biodigestão. Cada método tem suas vantagens e é adequado para diferentes situações.
            </p>
          </Col>
        </Row>

        <h2 className="section-title">Benefícios do tratamento adequado</h2>
        <Row>
          <Col md={6}>
            <div className="benefit-card">
              <i className="bi bi-tree"></i>
              <h4>Ambientais</h4>
              <p>Reduz o volume de resíduos enviados aos aterros e diminui a emissão de gases de efeito estufa.</p>
            </div>
          </Col>
          <Col md={6}>
            <div className="benefit-card">
              <i className="bi bi-cash"></i>
              <h4>Econômicos</h4>
              <p>Produção de composto orgânico gratuito e redução de custos com coleta e tratamento de resíduos.</p>
            </div>
          </Col>
        </Row>
      </Container>

      <div className="footer">
        <Container>
          <p>Separar corretamente os resíduos orgânicos é uma das atitudes mais efetivas para reduzir nosso impacto ambiental.</p>
        </Container>
      </div>
      <Footer/>
    </div>
  );
};

export default Organic;