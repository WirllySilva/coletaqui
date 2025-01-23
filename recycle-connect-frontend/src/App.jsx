import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RecoverPassword from "./pages/RecoverPassword";
import Welcome from "./pages/Welcome";
import WelcomePage from "./pages/WelcomePage"
import AccountTypeChoice from "./pages/AccountTypeChoice";
import CollectorRegister from "./pages/CollectorRegister";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<WelcomePage/>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/recoverpassword" element={<RecoverPassword />} />
                <Route path="/account-typechoice" element={<AccountTypeChoice/>}/>
                <Route path="/collector-register" element={<CollectorRegister />} />
                <Route path="/welcome" element={<Welcome/>} />
                
            </Routes>
        </Router>
    );
}

export default App;
