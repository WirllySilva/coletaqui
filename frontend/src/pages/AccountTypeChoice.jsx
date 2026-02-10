import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";


function AccountTypeChoice() {
    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div style={{ maxWidth: "400px", width: "100%", padding:"20px", textAlign: "center"}}> 
                <h2 className="mb-3">Escolha seu tipo de conta</h2>
                <p className="mb-4">Faça a diferença hoje! Escolha uma opção abaixo para começar:</p>
                <div className="d-grid gap-3">
                    <Link to="/commonuser-register" className="btn btn-success">Separador de materiais recicláveis</Link>
                    <Link to="/collector-register" className="btn btn-primary">Coletor de Materiais</Link>
                </div>
            </div>
        </div>
    );
}

export default AccountTypeChoice;
