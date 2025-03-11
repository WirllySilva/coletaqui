import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CommonUserRegister from "./pages/CommonUserRegister";
import RecoverCommonUserPassword from "./pages/RecoverCommonUserPassword";
import RecoverCollectorPassword from "./pages/RecoverCollectorPassword";
import Welcome from "./pages/Welcome";
import WelcomePage from "./pages/WelcomePage";
import AccountTypeChoice from "./pages/AccountTypeChoice";
import CollectorRegister from "./pages/CollectorRegister";
import LoginSelectionpage from "./pages/LoginSelectionPage";
import CommonUserLoginPage from "./pages/CommonUserLoginPage";
import CollectorLoginPage from "./pages/CollectorLoginPage";
import Home from "./pages/Home";
import HowToSeparate from "./pages/HowToSeparate";
import PlantATree from "./pages/PlantATree";
import Ranking from "./pages/Ranking";
import Collectors from "./pages/Collectors";
import InfoBanner from "./pages/InfoBanner";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<WelcomePage/>} />
                <Route path="/commonuserloginpage" element={<CommonUserLoginPage />} />
                <Route path="/commonuser-register" element={<CommonUserRegister />} />
                <Route path="/recovercommonuserpassword" element={<RecoverCommonUserPassword />} />
                <Route path="/recovercollectorpassword" element={<RecoverCollectorPassword />} />
                <Route path="/account-typechoice" element={<AccountTypeChoice/>}/>
                <Route path="/collector-register" element={<CollectorRegister />} />
                <Route path="/welcome" element={<Welcome/>} />
                <Route path="/loginselectionpage" element={<LoginSelectionpage/>} />
                <Route path="/collectorloginpage" element={<CollectorLoginPage/>} />
                <Route path="/home" element={<Home/>} />
                <Route path="/howtoseparate" element={<HowToSeparate/>} />
                <Route path="/collectors" element={<Collectors/>} />
                <Route path="/plantatree" element={<PlantATree/>} />
                <Route path="/ranking" element={<Ranking/>} />
                <Route path="/infobanner" element={<InfoBanner/>} />

                
            </Routes>
        </Router>
    );
}

export default App;
