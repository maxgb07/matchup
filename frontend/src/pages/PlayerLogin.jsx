import React, { useState } from 'react';
import { Container, Card, Form, Button, Spinner, Row, Col, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo-matchcup.png';

const API_URL = import.meta.env.VITE_API_URL;

const PlayerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);
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

      localStorage.setItem('auth_token', data.access_token);
      localStorage.setItem('token_type', data.token_type);
      localStorage.setItem('user_name', data.player.NOMBRE);
      localStorage.setItem('user_id', data.player.ID);
      localStorage.setItem('tipo_usuario', data.tipo_usuario);
      localStorage.setItem('token', data.access_token);


      
      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: 'Inicio de sesión exitoso.',
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate('/player/dashboard');
      });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setRecoveryLoading(true);

    try {
      const response = await fetch(`${API_URL}password/forgot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email: recoveryEmail }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'No se pudo generar la nueva contraseña.');
      }

      Swal.fire({
        icon: 'success',
        title: '¡Nueva Contraseña Generada!',
        html: `Nueva contraseña generada y enviada al mail de registro.`,
        showConfirmButton: true,
      });
      setShowModal(false);
      setRecoveryEmail('');

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
    } finally {
      setRecoveryLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '100%', maxWidth: '400px' }} className="shadow-lg">
        <Card.Body>
          <div className="text-center mb-4">
            <img src={logo} alt="MatchCup Logo" className="img-fluid" style={{ maxWidth: '175px' }} />
            <h4 className="mt-3">Ingreso de Jugadores</h4>
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
            <div className="d-grid gap-2">
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
            </div>
          </Form>
          <div className="text-center mt-3">
            <a href="#" onClick={() => setShowModal(true)}>
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </Card.Body>
      </Card>

      {/* Modal para recuperar contraseña */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Recuperar Contraseña</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleForgotPasswordSubmit}>
          <Modal.Body>
            <Form.Group controlId="formRecoveryEmail">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu correo"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                required
              />
              <Form.Text className="text-muted">
                Ingresa el correo asociado a tu cuenta para restablecer tu contraseña.
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={recoveryLoading}>
              {recoveryLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Enviando...
                </>
              ) : (
                'Obtener Nueva Contraseña'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default PlayerLogin;