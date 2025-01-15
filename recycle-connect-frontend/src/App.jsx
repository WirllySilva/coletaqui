import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import './styles/App.css';

function App() {
    return (
        <div>
            <Header />
            <main>
                <h1>Welcome to Recycling Platform</h1>
                <p>Manage and optimize waste collection efficiently!</p>
            </main>
            <Footer />
        </div>
    );
}

export default App;
