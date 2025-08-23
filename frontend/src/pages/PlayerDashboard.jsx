import React, { useState } from 'react';
import { Container, Row, Col, Offcanvas, Button } from 'react-bootstrap';
import PlayerSidebar from '../components/PlayerSidebar'; // <-- Importa el nuevo sidebar del jugador
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const PlayerDashboard = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const handleShowSidebar = () => setShowSidebar(true);
  const handleCloseSidebar = () => setShowSidebar(false);

  // Obtiene el nombre del jugador directamente de localStorage
  const playerName = localStorage.getItem('user_name') || 'Jugador';

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col md={2} className="d-none d-md-block p-0">
          <PlayerSidebar playerName={playerName} />
        </Col>

        <Col xs={12} md={10} className="p-0">
          <div className="d-md-none bg-dark text-light p-3 d-flex justify-content-between align-items-center">
            <h4>{playerName}</h4>
            <Button variant="outline-light" onClick={handleShowSidebar}>
              <FontAwesomeIcon icon={faBars} />
            </Button>
          </div>

          <Offcanvas show={showSidebar} onHide={handleCloseSidebar}>
            <Offcanvas.Header closeButton className="bg-dark text-light">
              <Offcanvas.Title>Menú del Jugador</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="p-0">
              <PlayerSidebar onHide={handleCloseSidebar} playerName={playerName} />
            </Offcanvas.Body>
          </Offcanvas>

          <div className="p-4">
            <h1>Dashboard del Jugador</h1>
            <p>Bienvenido, {playerName}. Este es tu espacio personal.</p>
            {/* Aquí irá el contenido del dashboard del jugador, como sus estadísticas, próximos partidos, etc. */}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default PlayerDashboard;