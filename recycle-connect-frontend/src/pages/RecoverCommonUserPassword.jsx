import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function RecoverCommonUserPassword() {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
                <h2 className="text-center mb-4">Recuperar Senha</h2>
                <form>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            E-mail
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Digite seu e-mail"
                        />
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-success">
                            Recuperar Senha
                        </button>
                    </div>
                </form>
                <p className="text-center mt-3">
                    Lembrou sua senha? <Link to="/commonuserloginpage">Faça login</Link>
                </p>
            </div>
        </div>
    );
}

export default RecoverCommonUserPassword;
