import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Offcanvas, Alert } from 'react-bootstrap';
import ClubAdminSidebar from '../components/ClubAdminSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faEye } from '@fortawesome/free-solid-svg-icons';
import TournamentDetailsModal from '../components/TournamentDetailsModal';

const VerTorneos = () => {
    const [torneos, setTorneos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);
    
    // Estados para el modal
    const [showModal, setShowModal] = useState(false);
    const [selectedTorneoId, setSelectedTorneoId] = useState(null);

    const clubName = localStorage.getItem('club_name') || 'Admin del Club';
    const clubId = localStorage.getItem('id_club');
    const token = localStorage.getItem('token');
    const API_URL = import.meta.env.VITE_API_URL;

    const handleShowSidebar = () => setShowSidebar(true);
    const handleCloseSidebar = () => setShowSidebar(false);
    
    // Funciones para manejar el modal
    const handleShowModal = (torneoId) => {
        setSelectedTorneoId(torneoId);
        setShowModal(true);
    };
    const handleCloseModal = () => setShowModal(false);

    useEffect(() => {
        const fetchTorneos = async () => {
            if (!clubId) {
                setError('ID del club no encontrado. Por favor, inicie sesión de nuevo.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_URL}club-admin/torneos/${clubId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Error al obtener la lista de torneos.');
                }
                setTorneos(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTorneos();
    }, [API_URL, clubId]);

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
                        <h1 className="mb-4">Torneos del Club</h1>
                        
                        {loading && (
                            <div className="text-center">
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </Spinner>
                            </div>
                        )}

                        {error && <Alert variant="danger">{error}</Alert>}

                        {!loading && torneos.length === 0 && (
                            <Alert variant="info">No hay torneos registrados para este club.</Alert>
                        )}

                        {!loading && torneos.length > 0 && (
                            <Row xs={1} md={2} lg={3} className="g-4">
                                {torneos.map((torneo) => (
                                    <Col key={torneo.ID}>
                                        <Card className="h-100 shadow-sm">
                                            <Card.Body>
                                                <Card.Title className="text-primary">{torneo.NOMBRE}</Card.Title>
                                                <Card.Text>
                                                    <strong>Inicio:</strong> {torneo.FECHA_INICIO}<br />
                                                    <strong>Fin:</strong> {torneo.FECHA_FIN}<br />
                                                    <strong>Estado:</strong> {torneo.ESTADO}
                                                </Card.Text>
                                                <div className="d-grid mt-3">
                                                    <Button variant="outline-primary" onClick={() => handleShowModal(torneo.ID)}>
                                                        <FontAwesomeIcon icon={faEye} className="me-2" />
                                                        Ver Detalles
                                                    </Button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </div>
                </Col>
            </Row>

            {/* Renderizar el modal */}
            <TournamentDetailsModal 
                show={showModal} 
                onHide={handleCloseModal} 
                torneoId={selectedTorneoId} 
            />
        </Container>
    );
};

export default VerTorneos;