import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const LoginSelectionPage = () => {
    const navigate = useNavigate();

    return (
        <div className="container text-center">
            <h1 className="mt-5">Bem-vindo!</h1>
            <p className="lead mt-3">Escolha como deseja fazer login:</p>
            <div className="mt-4">
                <button
                    className="btn btn-success btn-lg mx-2"
                    onClick={() => navigate("/commonuserloginpage")}
                >
                    Login como Separador de materiais
                </button>
                <button
                    className="btn btn-success btn-lg mx-2"
                    onClick={() => navigate("/collectorloginpage")}
                >
                    Login como Coletor de materiais
                </button>
            </div>
        </div>
    );
};

export default LoginSelectionPage;
