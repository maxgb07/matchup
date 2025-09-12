import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Button, Modal, Offcanvas, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import PlayerSidebar from '../components/PlayerSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const API_URL = import.meta.env.VITE_API_URL;

const PlayerTournaments = () => {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSidebar, setShowSidebar] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [playerCategoryId, setPlayerCategoryId] = useState(null);
    const [submittingInscription, setSubmittingInscription] = useState(false);

    const playerNameLS = localStorage.getItem('user_name');
    const userType = localStorage.getItem('tipo_usuario');
    const token = localStorage.getItem('token');

    // Función para obtener la categoría del jugador
    const fetchPlayerData = async () => {
        try {
            const response = await fetch(`${API_URL}player/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('No se pudo cargar la información del jugador.');
            }
            const data = await response.json();
            setPlayerCategoryId(data.ID_CATEGORIA);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
            });
        }
    };
    
    // Función para obtener la lista de torneos
    const fetchTournaments = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}tournaments`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (!response.ok) {
                throw new Error('No se pudieron cargar los torneos.');
            }
            const data = await response.json();
            setTournaments(data);
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

    useEffect(() => {
        fetchPlayerData();
        fetchTournaments();
    }, []);

    const handleShowDetails = (tournament) => {
        setSelectedTournament(tournament);
        setShowDetailsModal(true);
    };

    const handleCloseDetails = () => {
        setShowDetailsModal(false);
        setSelectedTournament(null);
    };

    const handleInscription = async (tournamentId) => {
        setSubmittingInscription(true);
        try {
            const response = await fetch(`${API_URL}tournaments/inscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ tournament_id: tournamentId })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al inscribir al jugador.');
            }

            Swal.fire({
                icon: 'success',
                title: '¡Inscripción exitosa!',
                text: data.message || 'Te has inscrito al torneo.',
            });
            
            fetchTournaments();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error de Inscripción',
                text: error.message,
            });
        } finally {
            setSubmittingInscription(false);
        }
    };

    const isPlayerCategoryAllowed = (tournament) => {
        if (!playerCategoryId || !tournament.categorias) {
            return false;
        }
        return tournament.categorias.some(cat => cat.ID === playerCategoryId);
    };

    const getSidebarComponent = (type) => {
        switch (type) {
            case '3':
                return <PlayerSidebar playerName={playerNameLS} />;
            default:
                return null;
        }
    };

    return (
        <Container fluid className="p-0">
            <Row className="g-0 h-100">
                {userType === '3' && (
                    <Col md={2} className="d-none d-md-block p-0 h-100">
                        {getSidebarComponent(userType)}
                    </Col>
                )}
                <Col xs={12} md={userType === '3' ? 10 : 12} className="p-0 h-100">
                    <div className="d-md-none bg-dark text-light p-3 d-flex justify-content-between align-items-center">
                        <h4>{playerNameLS}</h4>
                        <Button variant="outline-light" onClick={() => setShowSidebar(!showSidebar)}>
                            <FontAwesomeIcon icon={faBars} />
                        </Button>
                    </div>
                    <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)}>
                        <Offcanvas.Header closeButton className="bg-dark text-light">
                            <Offcanvas.Title>Menú</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body className="p-0">
                            {getSidebarComponent(userType)}
                        </Offcanvas.Body>
                    </Offcanvas>
                    <div className="p-4">
                        <h1 className="mb-4">Torneos Disponibles</h1>
                        {loading ? (
                            <div className="text-center mt-3">
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </Spinner>
                            </div>
                        ) : tournaments.length === 0 ? (
                            <div className="text-center mt-3">
                                <p>No hay torneos registrados actualmente.</p>
                            </div>
                        ) : (
                            <Row xs={1} md={2} lg={3} className="g-4">
                                {tournaments.map((tournament) => (
                                    <Col key={tournament.ID}>
                                        <Card className="h-100 shadow-sm" onClick={() => handleShowDetails(tournament)} style={{ cursor: 'pointer' }}>
                                            <Card.Body>
                                                <Card.Title>{tournament.NOMBRE}</Card.Title>
                                                <Card.Text>
                                                    <p className="mb-1"><strong>Lugar:</strong> {tournament.club?.NOMBRE || 'N/A'}</p>
                                                    <p className="mb-1"><strong>Fechas:</strong> Del {new Date(tournament.FECHA_INICIO).toLocaleDateString('es-ES')} al {new Date(tournament.FECHA_FIN).toLocaleDateString('es-ES')}</p>
                                                    <p className="mb-1"><strong>Costo por Pareja:</strong> ${tournament.COSTO_POR_PAREJA}</p>
                                                    <p className="mb-1"><strong>Fecha Límite de Inscripción:</strong> {new Date(tournament.FECHA_INSCRIPCION_LIMITE).toLocaleDateString('es-ES')}</p>
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </div>
                </Col>
            </Row>

            {/* Modal de detalles del torneo */}
            <Modal show={showDetailsModal} onHide={handleCloseDetails}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedTournament?.NOMBRE}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedTournament && (
                        <>
                            <p><strong>Fechas:</strong> Del {new Date(selectedTournament.FECHA_INICIO).toLocaleDateString('es-ES')} al {new Date(selectedTournament.FECHA_FIN).toLocaleDateString('es-ES')}</p>
                            <p><strong>Lugar:</strong> {selectedTournament.club?.NOMBRE || 'N/A'}</p>
                            <p><strong>Costo por Pareja:</strong> ${selectedTournament.COSTO_POR_PAREJA}</p>
                            <p><strong>Fecha Límite de Inscripción:</strong> {new Date(selectedTournament.FECHA_INSCRIPCION_LIMITE).toLocaleDateString('es-ES')}</p>
                            <p><strong>Descripción:</strong> {selectedTournament.DESCRIPCION}</p>
                            
                            <h5 className="mt-4">Categorías Permitidas</h5>
                            <Table striped bordered hover size="sm">
                                <thead>
                                    <tr>
                                        <th>Categoría</th>
                                        <th>Cupos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedTournament.categorias.map(cat => (
                                        <tr key={cat.ID}>
                                            <td>{`${cat.NOMBRE} ${cat.GENERO}`}</td>
                                            <td>{cat.pivot?.CUPO_PAREJAS || 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {selectedTournament && isPlayerCategoryAllowed(selectedTournament) && (
                        <Button variant="success" onClick={() => handleInscription(selectedTournament.ID)} disabled={submittingInscription}>
                            {submittingInscription ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                    Inscribiendo...
                                </>
                            ) : (
                                'Inscribirme'
                            )}
                        </Button>
                    )}
                    <Button variant="secondary" onClick={handleCloseDetails} disabled={submittingInscription}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default PlayerTournaments;