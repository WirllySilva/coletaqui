import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../styles/pages/InfoBanner.css";
import Footer from "../components/Footer";

const InfoBanner = () => {
    return (
        <div className="info-banner">
            <div className="hero-section">
                <Container>
                    <h5 className="title">O QUE VOCÊ PRECISA SABER SOBRE COLETA SELETIVA</h5>
                    <p className="subtitle">
                        Um pequeno gesto individual com grande impacto coletivo para a preservação do meio ambiente e o futuro sustentável do planeta.
                    </p>
                </Container>
            </div>
            <Container>
                <p className="first-paragraph">
                    A coleta seletiva é um sistema de recolhimento de materiais recicláveis que podem ser reaproveitados, diminuindo o impacto ambiental e contribuindo para a sustentabilidade. Veja os principais pontos que você precisa conhecer:
                </p>
            </Container>

            <Container>
                <h2 className="section-title">Como funciona</h2>
                <Row>
                    <Col lg={8} className="mx-auto">
                        <p className="lead">
                            A coleta seletiva separa os resíduos conforme sua composição: papel, plástico, vidro, metal e orgânicos. Cada tipo de material é destinado a processos específicos de reciclagem, permitindo sua transformação em novos produtos.
                        </p>
                    </Col>
                </Row>

                <h2 className="section-title">Cores da coleta seletiva</h2>
                <Row>
                    {[
                        { id: 1, color: "blue", text: "AZUL\nPapel/Papelão" },
                        { id: 2, color: "red", text: "VERMELHO\nPlástico" },
                        { id: 3, color: "green", text: "VERDE\nVidro" },
                        { id: 4, color: "yellow", text: "AMARELO\nMetal" },
                        { id: 5, color: "brown", text: "MARROM\nOrgânicos" },
                        { id: 6, color: "gray", text: "CINZA\nNão reciclável" }
                    ].map((box) => (
                        <Col key={box.id} md={4} lg={2}>
                            <div className={`color-box ${box.color}`}>{box.text}</div>
                        </Col>
                    ))}
                </Row>

                <h2 className="section-title">Benefícios</h2>
                <Row>
                    {[
                        { id: 1, icon: "bi-trash", title: "Redução de lixo", text: "Redução do volume de lixo em aterros sanitários." },
                        { id: 2, icon: "bi-tree", title: "Economia de recursos", text: "Conservação de recursos naturais." },
                        { id: 3, icon: "bi-droplet", title: "Redução de poluição", text: "Diminuição da poluição do solo, água e ar." },
                        { id: 4, icon: "bi-people", title: "Geração de empregos", text: "Criação de postos de trabalho." },
                        { id: 5, icon: "bi-lightning", title: "Economia de energia", text: "Reprocessar materiais consome menos energia." }
                    ].map((benefit) => (
                        <Col key={benefit.id} md={4} className="mb-4">
                            <div className="benefit-card">
                                <i className={`bi ${benefit.icon}`}></i>
                                <h4>{benefit.title}</h4>
                                <p>{benefit.text}</p>
                            </div>
                        </Col>
                    ))}
                </Row>

                <h2 className="section-title">Como participar</h2>
                <div className="steps-container">
                    {[
                        { id: 1, number: 1, title: "Separe o lixo em sua casa ou local de trabalho", text: "Tenha recipientes diferentes para cada tipo de material reciclável." },
                        { id: 2, number: 2, title: "Lave embalagens que contiveram alimentos", text: "Remova restos de alimentos para evitar mau cheiro e atrair insetos." },
                        { id: 3, number: 3, title: "Desmonte caixas de papelão", text: "Isso ajuda a ocupar menos espaço e facilitar o transporte." },
                        { id: 4, number: 4, title: "Informe-se sobre os dias e horários da coleta seletiva em sua região", text: "Verifique os dias e horários em que o serviço é realizado na sua área." },
                        { id: 5, number: 5, title: "Procure pontos de entrega voluntária próximos à sua residência", text: "Identifique locais próximos que recebam materiais recicláveis." }
                    ].map((step) => (
                        <div key={step.id} className="step">
                            <div className="step-number">{step.number}</div>
                            <div className="step-content">
                                <h4>{step.title}</h4>
                                <p>{step.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <h2 className="section-title">O que pode e não pode ser reciclado</h2>
                <Row>
                    <Col md={6}>
                        <div className="recycle-list">
                            <h4>Recicláveis comuns:</h4>
                            <ul>
                                <li><strong>Papel:</strong> jornais, revistas, cadernos, embalagens</li>
                                <li><strong>Plástico:</strong> garrafas, embalagens, sacos</li>
                                <li><strong>Vidro:</strong> garrafas, potes, frascos</li>
                                <li><strong>Metal:</strong> latas de alumínio, tampas, panelas sem cabo</li>
                            </ul>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="recycle-list">
                            <h4>Não recicláveis ou que exigem coleta especial:</h4>
                            <ul>
                                <li>Papéis engordurados, adesivos, fotografias</li>
                                <li>Espelhos, cristais, cerâmicas, lâmpadas</li>
                                <li>Pilhas, baterias e eletrônicos (precisam de coleta específica)</li>
                                <li>Isopor (em alguns lugares já há reciclagem específica)</li>
                            </ul>
                        </div>
                    </Col>
                </Row>
            </Container>

            <div className="footer">
                <Container>
                    <p>Adotar a coleta seletiva é um pequeno gesto individual com grande impacto coletivo para a preservação do meio ambiente e o futuro sustentável do planeta.</p>
                </Container>
            </div>
            <Footer />
        </div>
    );
};

export default InfoBanner;