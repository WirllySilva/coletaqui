import React, { useState } from 'react';
import { Form, Button, Container, Image, Alert } from 'react-bootstrap';
import userIcon from '../assets/user-icon.png'; // Imagem padrão
import '../styles/pages/UserData.css';
import Footer from '../components/Footer';

const UserData = () => {
    const [user, setUser] = useState({
        name: 'Nome do Usuário',
        email: 'usuario@email.com',
        phone: '(11) 91234-5678',
        photo: userIcon,
    });

    const [editing, setEditing] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();

        // Validação simples
        if (!user.name || !user.email) {
            setMessage({ type: 'danger', text: 'Preencha todos os campos obrigatórios.' });
            return;
        }

        setEditing(false);
        setMessage({ type: 'success', text: 'Dados salvos com sucesso!' });
        // TODO: integrar com backend futuramente
    };

    const handleEdit = () => {
        setEditing(true);
        setMessage({ type: '', text: '' });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const photoUrl = URL.createObjectURL(file);
            setUser((prev) => ({ ...prev, photo: photoUrl }));
        }
    };

    return (
        <Container className="userdata-container">
            <h4 className="userdata-title">Dados do Usuário</h4>

            <div className="userdata-photo-container">
                <Image src={user.photo} roundedCircle width={100} height={100} className="userdata-photo" />
                {editing && (
                    <Form.Group controlId="formPhoto" className="mt-2">
                        <Form.Control type="file" accept="image/*" onChange={handlePhotoChange} />
                    </Form.Group>
                )}
            </div>

            {message.text && (
                <Alert variant={message.type} className="userdata-alert">
                    {message.text}
                </Alert>
            )}

            <Form onSubmit={handleSave} className="userdata-form">
                <Form.Group className="mb-3">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        disabled={!editing}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>E-mail</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        disabled={!editing}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Telefone</Form.Label>
                    <Form.Control
                        type="tel"
                        name="phone"
                        value={user.phone}
                        onChange={handleChange}
                        disabled={!editing}
                    />
                </Form.Group>
                {editing && (
                    <div className="d-grid mt-3">
                        <Button variant="primary" type="submit">
                            Salvar Alterações
                        </Button>
                    </div>
                )}
            </Form>

            {!editing && (
                <div className="d-grid mt-3">
                    <Button variant="success" onClick={handleEdit}>
                        Editar Dados
                    </Button>
                </div>
            )}
            <Footer />
        </Container>
        
    );
};

export default UserData;
