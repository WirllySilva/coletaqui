  import React from "react";
  import { useNavigate } from "react-router-dom";
  import "../styles/components/MapPreview.css";
  import mapIcon from "../assets/map-icon.png"; // Ícone temporário do mapa

  const MapPreview = () => {
    const navigate = useNavigate();

    return (
      <button
        className="map-container"
        onClick={() => navigate("/map")}
        aria-label="Visualizar mapa" // Adiciona uma descrição para leitores de tela
      >
        <img src={mapIcon} alt="Mapa" className="map-icon" />
        <p className="map-text">Toque para visualizar o mapa</p>
      </button>
    );
  };

  export default MapPreview;
