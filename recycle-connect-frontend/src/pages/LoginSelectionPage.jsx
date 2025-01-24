import React from "react";
import { useNavigate } from "react-router-dom";

const LoginSelectionPage = () => {
    const navigate = useNavigate();

    return (
        <div className="container text-center">
            <h1 className="mt-5">Bem-vindo!</h1>
            <p className="lead mt-3">Escolha como deseja fazer login:</p>
            <div className="mt-4">
                <button
                    className="btn btn-success btn-lg mx-2"
                    onClick={() => navigate("/login-ecoamigo")}
                >
                    Login como EcoAmigo
                </button>
                <button
                    className="btn btn-success btn-lg mx-2"
                    onClick={() => navigate("/login-ecocoletor")}
                >
                    Login como EcoColetor
                </button>
            </div>
        </div>
    );
};

export default LoginSelectionPage;
