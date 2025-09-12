import React, { useState } from 'react';
import { Container, Card, Form, Button, Spinner, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo-matchcup.png';

const ClubAdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}club-admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en el inicio de sesión');
      }

      // Guardar el token y el nombre del club en localStorage
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('club_name', data.club_name);
      localStorage.setItem('tipo_usuario', data.tipo_usuario);
      localStorage.setItem('id_club', data.id_club);

      Swal.fire({
        icon: 'success',
        title: '¡Inicio de sesión exitoso!',
        text: 'Redirigiendo al panel de administración del club...',
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        navigate('/club-admin/dashboard');
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

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}club-admin/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al restablecer la contraseña.');
      }

      Swal.fire({
        icon: 'success',
        title: '¡Correo enviado!',
        text: data.message,
      });

      handleCloseModal();
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
          <div className="text-center">
            <img src={logo} alt="Logo de matchcup, sitio web de pádel" className="img-fluid" style={{ maxWidth: '250px' , marginTop: '-30%'}} />
            <h2 className="text-center" style={{ marginTop: '-10%'}} >Inicio Sesión Club </h2>
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
                placeholder="Contraseña"
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
          <div className="text-center mt-3">
            <a href="#" onClick={handleShowModal} style={{ color: '#007bff', textDecoration: 'none' }}>
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Form onSubmit={handleForgotPassword}>
          <Modal.Header closeButton>
            <Modal.Title>Restablecer Contraseña</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="forgotPasswordEmail">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu correo"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                required
              />
              <Form.Text className="text-muted">
                Ingresa el correo asociado a tu cuenta para restablecer tu contraseña.
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Enviar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default ClubAdminLogin;