import React from "react";
import Footer from "../components/Footer";
import "../styles/pages/Ranking.css";

const Ranking = () => {
  return (
    <div className="ranking">
      <main className="content">
        <h2>Ranking</h2>
        <p>Veja a classificação dos usuários que mais reciclam.</p>
      </main>
      <Footer />
    </div>
  );
};

export default Ranking;