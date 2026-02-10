import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../styles/pages/Paper.css";
import Footer from "../components/Footer";

const Paper = () => {
  return (
    <div className="paper-banner">
      <header className="custom-header d-flex align-items-center px-3 pt-4">
        <Container>
          <h5 className="title">Coleta de Papel: Guia Completo de Reciclagem</h5>
        </Container>
      </header>

      <Container>
        <p className="subtitle">
          A coleta de papel é uma parte fundamental da reciclagem, economizando recursos naturais e reduzindo significativamente o impacto ambiental. Veja tudo o que você precisa saber sobre como reciclar papel corretamente:
        </p>

        <h2 className="section-title">Identificação e Separação</h2>
        <Row>
          <Col lg={8} className="mx-auto">
            <p className="lead">
              Cor da categoria: <strong>AZUL</strong>
            </p>
            <p>
              Todos os tipos de papel e papelão devem ser descartados em lixeiras azuis. O símbolo internacional de reciclagem com o número 21 ou 22 identifica materiais de papel.
            </p>
          </Col>
        </Row>

        <h2 className="section-title">O que pode ser reciclado</h2>
        <Row>
          <Col md={6}>
            <div className="recycle-list">
              <h4>Papéis recicláveis:</h4>
              <ul>
                <li>Jornais e revistas</li>
                <li>Folhas de caderno e sulfite</li>
                <li>Envelopes (sem janelas plásticas)</li>
                <li>Caixas de papelão</li>
                <li>Embalagens longa vida (Tetra Pak)</li>
                <li>Papel de embrulho</li>
                <li>Cartões e cartolinas</li>
                <li>Papel cartão</li>
                <li>Formulários de computador</li>
                <li>Aparas de papel</li>
                <li>Folhetos publicitários</li>
              </ul>
            </div>
          </Col>
          <Col md={6}>
            <div className="recycle-list">
              <h4>Papéis não recicláveis:</h4>
              <ul>
                <li>Papel higiênico, guardanapos e lenços usados</li>
                <li>Papéis plastificados, metalizados ou parafinados</li>
                <li>Papéis sujos, engordurados ou contaminados</li>
                <li>Adesivos e etiquetas</li>
                <li>Fotografias</li>
                <li>Papel carbono</li>
                <li>Papel térmico (de recibos)</li>
                <li>Papel de fax</li>
                <li>Papel vegetal</li>
              </ul>
            </div>
          </Col>
        </Row>

        <h2 className="section-title">Como preparar o papel para reciclagem</h2>
        <div className="steps-container">
          {[
            { id: 1, number: 1, title: "Remova elementos não recicláveis", text: "Retire grampos, clipes, fitas adesivas e espirais. Separe as janelas plásticas de envelopes." },
            { id: 2, number: 2, title: "Dobre ou amasse", text: "Desmonte caixas de papelão para ocuparem menos espaço. Amasse papéis para otimizar o armazenamento." },
            { id: 3, number: 3, title: "Mantenha limpo e seco", text: "Evite misturar com resíduos líquidos ou orgânicos. Armazene em local protegido de chuva." },
            { id: 4, number: 4, title: "Separe por tipo (opcional)", text: "Agrupar papéis similares facilita o processo nas cooperativas. Papelão, papel branco e jornais podem ser separados em grupos." }
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

        <h2 className="section-title">Ciclo de reciclagem do papel</h2>
        <Row>
          <Col lg={8} className="mx-auto">
            <p>
              O ciclo de reciclagem do papel envolve coleta, triagem, trituração, purificação, branqueamento, refino, formação da folha e secagem. Cada etapa é crucial para transformar o papel usado em novos produtos.
            </p>
          </Col>
        </Row>

        <h2 className="section-title">Benefícios da reciclagem de papel</h2>
        <Row>
          <Col md={6}>
            <div className="benefit-card">
              <i className="bi bi-tree"></i>
              <h4>Ambientais</h4>
              <p>Cada tonelada de papel reciclado poupa o corte de 15-20 árvores e reduz a poluição do ar e da água.</p>
            </div>
          </Col>
          <Col md={6}>
            <div className="benefit-card">
              <i className="bi bi-cash"></i>
              <h4>Econômicos</h4>
              <p>Gera empregos nas cooperativas de reciclagem e diminui custos de produção industrial.</p>
            </div>
          </Col>
        </Row>


        <h2 className="section-title">Dicas práticas para o dia a dia</h2>
        <Row>
          <Col lg={8} className="mx-auto">
            <ul className="tips-list">
              <li>Utilize os dois lados das folhas antes de descartá-las.</li>
              <li>Prefira recibos digitais aos impressos.</li>
              <li>Reutilize caixas de papelão para armazenamento antes de enviá-las para reciclagem.</li>
              <li>Cancele correspondências impressas desnecessárias.</li>
              <li>Crie um ponto de coleta de papel dedicado em sua casa ou escritório.</li>
              <li>Verifique se há cooperativas de catadores na sua região que recolhem papel.</li>
              <li>Dê preferência a produtos feitos com papel reciclado para fechar o ciclo.</li>
            </ul>
          </Col>
        </Row>

        <h2 className="section-title">Curiosidades</h2>
        <Row>
          <Col lg={8} className="mx-auto">
            <ul className="curiosities-list">
              <li>O papel pode ser reciclado de 5 a 7 vezes antes que suas fibras fiquem curtas demais.</li>
              <li>O Brasil recicla aproximadamente 68% do papel ondulado consumido.</li>
              <li>Um brasileiro produz, em média, 96 kg de resíduos de papel por ano.</li>
              <li>A reciclagem de papel reduz em 70% o consumo de água em comparação com a produção a partir de fibras virgens.</li>
            </ul>
          </Col>
        </Row>

        <div className="footer">
          
            <p>Adotar práticas adequadas de reciclagem de papel é um passo simples mas poderoso para contribuir com a preservação ambiental.</p>
         
        </div>
      </Container>
      <Footer />
    </div>

  );
};

export default Paper;