import React, { useState } from "react";
import { Container, Dropdown, Image } from "react-bootstrap";
import userIcon from "../assets/user-icon.png"; // Adicione a imagem na pasta assets
import "../styles/components/Header.css"; 

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="custom-header d-flex align-items-center px-3 pt-4"> {/* Adicionado pt-4 para espaçamento no topo */}
      <div className="user-container d-flex align-items-center">
        <Dropdown show={showDropdown} onToggle={() => setShowDropdown(!showDropdown)}>
          <Dropdown.Toggle variant="link" id="dropdown-user" className="p-0 border-0">
            <Image src={userIcon} roundedCircle width={40} height={40} />
          </Dropdown.Toggle>

          <Dropdown.Menu align="end">
            <Dropdown.Item>Alterar Nome</Dropdown.Item>
            <Dropdown.Item>Alterar Endereço</Dropdown.Item>
            <Dropdown.Item>Trocar Número</Dropdown.Item>
            <Dropdown.Item>Alterar Foto</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item className="text-danger">Sair da Conta</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <h5 className="mb-0 ms-2">Olá, nome do usuário!</h5>
      </div>
    </header>
  );
};

export default Header;