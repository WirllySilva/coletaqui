import React, { useState } from "react";
import { Dropdown, Image } from "react-bootstrap";
import { FaUser, FaShareAlt, FaCog, FaSignOutAlt, FaWhatsapp } from "react-icons/fa";
import userIcon from "../assets/user-icon.png"; 
import "../styles/components/Header.css"; 

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="custom-header d-flex align-items-center px-3 pt-4">
      <div className="user-container d-flex align-items-center">
        <Dropdown show={showDropdown} onToggle={() => setShowDropdown(!showDropdown)}>
          <Dropdown.Toggle variant="link" id="dropdown-user" className="p-0 border-0">
            <Image src={userIcon} roundedCircle width={40} height={40} />
          </Dropdown.Toggle>

          <Dropdown.Menu align="end">
            <Dropdown.Item><FaUser className="me-2" /> Dados do Usuário</Dropdown.Item>
            <Dropdown.Item><FaShareAlt className="me-2" /> Compartilhar App</Dropdown.Item>
            <Dropdown.Item><FaWhatsapp className="me-2" style={{color: "green"}} /> Fale Conosco</Dropdown.Item>
            <Dropdown.Item><FaCog className="me-2" /> Configurações</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item className="text-danger"><FaSignOutAlt className="me-2" /> Sair da Conta</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <h5 className="mb-0 ms-2">Olá, nome do usuário!</h5>
      </div>
    </header>
  );
};

export default Header;
