import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function CollectorRegister() {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow p-4" style={{ maxWidth: "500px", width: "100%" }}>
                <h2 className="text-center mb-4">Criar Conta de Coletor</h2>
                <form>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Nome Completo</label>
                        <input type="text" className="form-control" id="name" placeholder="Digite seu nome" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">E-mail</label>
                        <input type="email" className="form-control" id="email" placeholder="Digite seu e-mail" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Senha</label>
                        <div className="input-group">
                            <input
                                type={passwordVisible ? "text" : "password"}
                                className="form-control"
                                id="password"
                                placeholder="Digite sua senha"
                            />
                            <button
                                className="input-group-text"
                                onClick={togglePasswordVisibility}
                                style={{ cursor: "pointer" }}
                            >
                                {passwordVisible ? (
                                    <i className="bi bi-eye-slash"></i> // Olho fechado
                                ) : (
                                    <i className="bi bi-eye"></i> // Olho aberto
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="cpf" className="form-label">CPF</label>
                        <input type="text" className="form-control" id="cpf" placeholder="Digite seu CPF" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="businessName" className="form-label">Nome da Empresa</label>
                        <input type="text" className="form-control" id="businessName" placeholder="Nome da empresa (opcional)" />
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-success">Criar Conta</button>
                    </div>
                </form>
                <p className="text-center mt-3">
                    Já tem uma conta? <a href="/collectorloginpage" className="text-decoration-none">Faça login</a>
                </p>
            </div>
        </div>
    );
}

export default CollectorRegister;
