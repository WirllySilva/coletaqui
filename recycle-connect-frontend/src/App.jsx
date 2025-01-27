import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CommonUserRegister from "./pages/CommonUserRegister";
import RecoverPassword from "./pages/RecoverPassword";
import Welcome from "./pages/Welcome";
import WelcomePage from "./pages/WelcomePage";
import AccountTypeChoice from "./pages/AccountTypeChoice";
import CollectorRegister from "./pages/CollectorRegister";
import LoginSelectionpage from "./pages/LoginSelectionPage";
import CommonUserLoginPage from "./pages/CommonUserLoginPage";
import CollectorLoginPage from "./pages/CollectorLoginPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<WelcomePage/>} />
                <Route path="/commonuserloginpage" element={<CommonUserLoginPage />} />
                <Route path="/commonuser-register" element={<CommonUserRegister />} />
                <Route path="/recoverpassword" element={<RecoverPassword />} />
                <Route path="/account-typechoice" element={<AccountTypeChoice/>}/>
                <Route path="/collector-register" element={<CollectorRegister />} />
                <Route path="/welcome" element={<Welcome/>} />
                <Route path="/loginselectionpage" element={<LoginSelectionpage/>} />
                <Route path="/collectorloginpage" element={<CollectorLoginPage/>} />
                
            </Routes>
        </Router>
    );
}

export default App;
