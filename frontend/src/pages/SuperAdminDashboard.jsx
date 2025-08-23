import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Offcanvas } from 'react-bootstrap';
import SuperAdminSidebar from '../components/SuperAdminSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const SuperAdminDashboard = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const handleShowSidebar = () => setShowSidebar(true);
  const handleCloseSidebar = () => setShowSidebar(false);

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        {/* Sidebar visible solo en PC y tablet */}
        <Col md={2} className="d-none d-md-block p-0">
          <SuperAdminSidebar />
        </Col>

        {/* Contenido principal */}
        <Col xs={12} md={10} className="p-0">
          {/* Encabezado con botón para móvil */}
          <div className="d-md-none bg-dark text-light p-3 d-flex justify-content-between align-items-center">
            <h4>Matchup</h4>
            <Button variant="outline-light" onClick={handleShowSidebar}>
              <FontAwesomeIcon icon={faBars} />
            </Button>
          </div>

          {/* Offcanvas (Sidebar para móvil) */}
          <Offcanvas show={showSidebar} onHide={handleCloseSidebar}> {/* Se quitó responsive="md" */}
            <Offcanvas.Header closeButton className="bg-dark text-light">
              <Offcanvas.Title>Menú</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="p-0">
              <SuperAdminSidebar onHide={handleCloseSidebar} />
            </Offcanvas.Body>
          </Offcanvas>

          {/* Contenido del Dashboard */}
          <div className="p-4">
            <h1 className="mb-4">Dashboard</h1>
            <p>Este es el panel principal de administración.</p>
            <Card>
              <Card.Body>
                <Card.Title>Estadísticas del Sistema</Card.Title>
                <p>Aquí se mostrarán los datos importantes del sistema, como el número de clubes, jugadores y partidos.</p>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SuperAdminDashboard;