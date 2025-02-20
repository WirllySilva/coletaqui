import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function CommonUserRegister() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const handleFocusOnConfirmPassword = () => {
        // Hide the password in the first field when focusing on the second  field
        setPasswordVisible(false);
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div  style={{ maxWidth: "400px", width: "100%", padding: "20px" }}>
                <h2 className="text-center mb-4">Criar conta de Separador</h2>
                <form>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                            Nome Completo
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder="Digite seu nome completo"
                        />
                    </div>
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
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Senha
                        </label>
                        <div className="input-group">
                            <input
                                type={passwordVisible ? "text" : "password"}
                                className="form-control"
                                id="password"
                                placeholder="Digite sua senha"
                                onBlur={handleFocusOnConfirmPassword} // Called when leaving the field
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={togglePasswordVisibility}
                            >
                                <i className={`bi ${passwordVisible ? "bi-eye-slash" : "bi-eye"}`}></i>
                            </button>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirm-password" className="form-label">
                            Confirme a Senha
                        </label>
                        <div className="input-group">
                            <input
                                type={confirmPasswordVisible ? "text" : "password"}
                                className="form-control"
                                id="confirm-password"
                                placeholder="Digite novamente sua senha"
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={toggleConfirmPasswordVisibility}
                            >
                                <i className={`bi ${confirmPasswordVisible ? "bi-eye-slash" : "bi-eye"}`}></i>
                            </button>
                        </div>
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-success">
                            Criar Conta
                        </button>
                    </div>
                </form>
                <p className="text-center mt-3">
                    Já tem uma conta? <Link to="/commonuserloginpage">Faça login</Link>
                </p>
            </div>
        </div>
    );
}

export default CommonUserRegister;
