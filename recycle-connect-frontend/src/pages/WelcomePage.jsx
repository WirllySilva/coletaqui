import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";


function WelcomePage() {
    return (
        <div className="welcome-page d-flex flex-column justify-content-center align-items-center vh-100">
            <div className="text-center">
                {/* Logo */}
                <img
                    src="/logo.png" // Substitua pelo caminho correto do logo
                    alt="Logo"
                    className="mb-4 logo"
                />

                {/* Tagline */}
                <h2 className="tagline">Conectando pessoas, reciclando o planeta</h2>

                {/* Ações */}
                <div className="mt-4">
                    <Link to="login" className="btn btn-success btn-lg me-3">
                        Entrar
                    </Link>
                    <Link to="account-typechoice" className="btn btn-outline-success btn-lg">
                        Criar Conta
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default WelcomePage;
