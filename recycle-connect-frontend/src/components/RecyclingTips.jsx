import React, { useState } from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { appendDots, customPaging } from "../utils/SlideUtils.jsx"; // Importa as funções
import "../styles/components/RecyclingTips.css";

const RecyclingTips = ({ tips }) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0); // Estado para rastrear o slide atual

  // Configurações do carrossel
  const settings = {
    dots: true, // Mostra os pontos indicadores
    infinite: true, // Rolar infinitamente
    speed: 500, // Velocidade da transição
    slidesToShow: 1, // Quantidade de slides visíveis
    slidesToScroll: 1, // Quantidade de slides a rolar por vez
    arrows: true, // Mostra setas de navegação
    beforeChange: (current, next) => setCurrentSlide(next), // Atualiza o slide atual
    appendDots: appendDots, // Passa a função appendDots
    customPaging: (i) => customPaging(i, currentSlide), // Passa a função customPaging com o estado currentSlide
  };

  return (
    <div className="recycling-tips">
      <h5 className="recycling-tips-title">Dicas de reciclagem e notícias</h5>
      {tips.length > 0 ? (
        <Slider {...settings}>
          {tips.map((tip) => (
            <div key={tip.id}>
              <Card className="card-tips">
                <Card.Body className="card-content">
                  <Card.Title>{tip.title}</Card.Title>
                  <Card.Text>{tip.summary}</Card.Text>
                  <Button variant="success" onClick={() => navigate(tip.link)}>
                    Leia mais
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </Slider>
      ) : (
        <Card className="p-3 card-tips mt-2">
          <p>Nenhuma dica disponível no momento.</p>
        </Card>
      )}
    </div>
  );
};

RecyclingTips.propTypes = {
  tips: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      summary: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default RecyclingTips;