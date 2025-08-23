import React, { useState } from 'react';
import { Container, Row, Col, Offcanvas, Button } from 'react-bootstrap';
import ClubAdminSidebar from '../components/ClubAdminSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const ClubAdminDashboard = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const handleShowSidebar = () => setShowSidebar(true);
  const handleCloseSidebar = () => setShowSidebar(false);

  // Obtiene el nombre del club directamente de localStorage
  const clubName = localStorage.getItem('club_name') || 'Admin del Club';

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col md={2} className="d-none d-md-block p-0">
          <ClubAdminSidebar clubName={clubName} />
        </Col>

        <Col xs={12} md={10} className="p-0">
          <div className="d-md-none bg-dark text-light p-3 d-flex justify-content-between align-items-center">
            <h4>{clubName}</h4>
            <Button variant="outline-light" onClick={handleShowSidebar}>
              <FontAwesomeIcon icon={faBars} />
            </Button>
          </div>

          <Offcanvas show={showSidebar} onHide={handleCloseSidebar}>
            <Offcanvas.Header closeButton className="bg-dark text-light">
              <Offcanvas.Title>Menú</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="p-0">
              <ClubAdminSidebar onHide={handleCloseSidebar} clubName={clubName} />
            </Offcanvas.Body>
          </Offcanvas>

          <div className="p-4">
            <h1>Dashboard del Administrador del Club</h1>
            <p>Bienvenido, {clubName}. Aquí podrás gestionar tu club.</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ClubAdminDashboard;