import React from "react";
import "../styles/pages/Login.css";

function Login() {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Bem-vindo</h2>
        <p className="text-center text-muted">Faça login para continuar</p>
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
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Senha</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Digite sua senha"
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">Login</button>
        </form>
        <div className="text-center mt-3">
          <a href="#" className="text-muted me-2">Esqueceu a senha?</a>
          <a href="#" className="text-success">Crie uma conta</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
