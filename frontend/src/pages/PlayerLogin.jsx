import React, { useState } from 'react';
import { Container, Card, Form, Button, Spinner, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo-matchcup.png';

const API_URL = import.meta.env.VITE_API_URL;

const PlayerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}player/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error de inicio de sesión.');
      }

      // Almacenar el token y otros datos del jugador en localStorage
      localStorage.setItem('auth_token', data.access_token);
      localStorage.setItem('token_type', data.token_type);
      localStorage.setItem('user_name', data.player.NOMBRE);
      localStorage.setItem('user_id', data.player.ID);
      localStorage.setItem('tipo_usuario', data.tipo_usuario);
      localStorage.setItem('token', data.access_token);

      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: 'Has iniciado sesión correctamente.',
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        navigate('/player/dashboard');
      });
      
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card className="p-4 mx-auto" style={{ maxWidth: '400px', width: '100%' }}>
        <Card.Body>
          <div className="text-center mb-4">
            <img src={logo} alt="Logo de matchcup, sitio web de pádel" className="img-fluid" style={{ maxWidth: '250px', marginTop: '-30%' }} />
            <h2 className="text-center" style={{ marginTop: '-10%'}} >Inicio Sesión Jugador </h2>
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mt-3" disabled={loading}>
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Cargando...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PlayerLogin;