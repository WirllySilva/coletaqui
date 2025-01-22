import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RecoverPassword from "./pages/RecoverPassword";
import Welcome from "./pages/Welcome";
import WelcomePage from "./pages/WelcomePage"

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Welcome/>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/recoverpassword" element={<RecoverPassword />} />
                <Route path="/WelcomePage" element={<WelcomePage/>} />
            </Routes>
        </Router>
    );
}

export default App;
