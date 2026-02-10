import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Welcome() {
    return (
        <div className="vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: "#e8f5e9" }}>
            <div className="container text-center">
                <h1 className="mb-4" style={{ color: "#2e7d32" }}>Bem-vindo ao Recycle Connect</h1>
                <p className="mb-4" style={{ fontSize: "1.2rem", color: "#4caf50" }}>
                    Faça a diferença hoje! Escolha uma opção abaixo para começar:
                </p>
                <div className="row justify-content-center">
                    <div className="col-md-4 mb-3">
                        <div className="card shadow">
                            <div className="card-body">
                                <img
                                    src="path/to/your-login-image.jpg"
                                    alt="Acessar"
                                    className="img-fluid mb-3"
                                />
                                <h5 className="card-title">Já tem uma conta?</h5>
                                <Link to="/login" className="btn btn-success">
                                    Acessar
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-3">
                        <div className="card shadow">
                            <div className="card-body">
                                <img
                                    src="path/to/your-register-image.jpg"
                                    alt="Criar Conta"
                                    className="img-fluid mb-3"
                                />
                                <h5 className="card-title">Novo por aqui?</h5>
                                <Link to="/register" className="btn btn-success">
                                    Criar Conta
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Welcome;
