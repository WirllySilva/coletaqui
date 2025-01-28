import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function LoginSelectionPage() {
    return (
        <div className="container d-flex flex-column justify-content-center align-items-center vh-100 text-center">
            <h2>Bem-vindo!</h2>
            <p>Escolha como deseja fazer login:</p>
            <div className="w-100 d-flex flex-column gap-3">
                <Link to="/commonuserloginpage" className="btn btn-success btn-lg w-100">
                    Login como Separador de materiais
                </Link>
                <Link to="/collectorloginpage" className="btn btn-success btn-lg w-100">
                    Login como Coletor de materiais
                </Link>
            </div>
        </div>
    );
}

export default LoginSelectionPage;
