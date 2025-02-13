// utils/sliderUtils.js

// Função appendDots
export const appendDots = (dots) => (
    <div className="dots-container">
      <ul style={{ margin: "0", padding: "0", display: "flex", gap: "8px" }}>
        {dots}
      </ul>
    </div>
  );
  
  // Função customPaging
  export const customPaging = (i, currentSlide) => (
    <div
      style={{
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        backgroundColor: i === currentSlide ? "#218838" : "#c3e6cb", // Verde escuro para o atual, verde claro para os demais
        transition: "background-color 0.3s ease", // Suaviza a transição de cor
      }}
    ></div>
  );