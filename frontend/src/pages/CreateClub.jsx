import React, { useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Offcanvas, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import SuperAdminSidebar from '../components/SuperAdminSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
const API_URL = import.meta.env.VITE_API_URL;

const CreateClub = () => {
  const [name, setName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); // Nuevo estado para el loader
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  const handleShowSidebar = () => setShowSidebar(true);
  const handleCloseSidebar = () => setShowSidebar(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Activa el loader al enviar el formulario

    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Error de autenticación',
        text: 'Por favor, inicie sesión nuevamente.',
      });
      navigate('/super-admin/login');
      setLoading(false); // Desactiva el loader en caso de error de autenticación
      return;
    }

    try {
      const response = await fetch(`${API_URL}super-admin/clubs/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, subdomain, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear el club');
      }

      Swal.fire({
        icon: 'success',
        title: '¡Club creado!',
        text: data.message,
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        navigate('/super-admin/dashboard');
      });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
    } finally {
      setLoading(false); // Desactiva el loader al finalizar la petición
    }
  };

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col md={2} className="d-none d-md-block">
          <SuperAdminSidebar />
        </Col>

        <Col xs={12} md={10} className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <div className="d-md-none bg-dark text-light p-3 d-flex justify-content-between align-items-center w-100">
            <h4>matchcup</h4>
            <Button variant="outline-light" onClick={handleShowSidebar}>
              <FontAwesomeIcon icon={faBars} />
            </Button>
          </div>

          <Offcanvas show={showSidebar} onHide={handleCloseSidebar}>
            <Offcanvas.Header closeButton className="bg-dark text-light">
              <Offcanvas.Title>Menú</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="p-0">
              <SuperAdminSidebar onHide={handleCloseSidebar} />
            </Offcanvas.Body>
          </Offcanvas>

          <div className="p-4 w-100 d-flex justify-content-center">
            <Card className="shadow" style={{ maxWidth: '600px', width: '100%' }}>
              <Card.Body>
                <h2 className="mb-4 text-center">Crear Nuevo Club</h2>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre del Club</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ej: Padel Club"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Subdominio</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ej: padelclub"
                      value={subdomain}
                      onChange={(e) => setSubdomain(e.target.value)}
                      required
                    />
                    <Form.Text className="text-muted">
                      Se usará para la URL única del club (ej: padelclub.matchcup.com).
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email del Administrador</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="ejemplo@padelclub.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Form.Text className="text-muted">
                      El administrador del club recibirá un correo con los datos de acceso.
                    </Form.Text>
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100" disabled={loading}>
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
                        Creando...
                      </>
                    ) : (
                      'Crear Club'
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateClub;