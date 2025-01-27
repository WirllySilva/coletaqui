import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function CollectorLoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center">Bem vindo de volta</h2>
        <p className="text-center">Faça login para continuar</p>
        <form>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">E-mail</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Digite seu e-mail"
              required
            />
          </div>
          <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label">Senha</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="password"
                placeholder="Digite sua senha"
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <i className="bi bi-eye-slash"></i> // Ícone de olho fechado
                ) : (
                  <i className="bi bi-eye"></i> // Ícone de olho aberto
                )}
              </button>
            </div>
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-success">Login</button>
          </div>
          <div className="text-center mt-3">
            <a href="recoverpassword" className="text-decoration-none">Esqueceu a senha?</a> |{" "}
            <a href="collector-register" className="text-decoration-none">Crie uma conta</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CollectorLoginPage;
