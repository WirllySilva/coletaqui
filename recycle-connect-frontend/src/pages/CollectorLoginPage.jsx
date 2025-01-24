import React, { useState } from "react";

const CollectorLoginPage = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center">Login EcoColetor</h1>
            <form className="mt-4">
                <div className="form-group">
                    <label htmlFor="email">E-mail</label>
                    <input
                        type="email"
                        id="email"
                        className="form-control"
                        placeholder="Digite seu e-mail"
                        required
                    />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="password">Senha</label>
                    <div className="input-group">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            id="password"
                            className="form-control"
                            placeholder="Digite sua senha"
                            required
                        />
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={togglePasswordVisibility}
                        >
                            {passwordVisible ? (
                                <i className="bi bi-eye-slash"></i> // Olho fechado
                            ) : (
                                <i className="bi bi-eye"></i> // Olho aberto
                            )}
                        </button>
                    </div>
                </div>
                <button type="submit" className="btn btn-success btn-lg mt-4 w-100">
                    Entrar
                </button>
            </form>
        </div>
    );
};

export default CollectorLoginPage;
