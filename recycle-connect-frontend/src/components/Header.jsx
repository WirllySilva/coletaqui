import React from 'react';
import '../styles/components/Header.css';

function Header() {
    return (
        <header>
            <h1>Recycling Platform</h1>
            <nav>
                <a href="/">Home</a>
                <a href="/about">About</a>
                <a href="/rewards">Rewards</a>
            </nav>
        </header>
    );
}

export default Header;
