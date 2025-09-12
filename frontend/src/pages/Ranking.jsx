// En frontend/src/pages/Ranking.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Spinner, Button, Offcanvas, Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import PlayerSidebar from '../components/PlayerSidebar';
import ClubAdminSidebar from '../components/ClubAdminSidebar';
import SuperAdminSidebar from '../components/SuperAdminSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const API_URL = import.meta.env.VITE_API_URL;

const Ranking = () => {
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    
    // Estados para los campos del formulario de búsqueda
    const [selectedCategory, setSelectedCategory] = useState('');
    const [playerName, setPlayerName] = useState('');
    
    // Estados que activan la búsqueda al hacer clic en el botón
    const [filterCategory, setFilterCategory] = useState('');
    const [filterPlayerName, setFilterPlayerName] = useState('');
    
    // Estados para la modal de puntos
    const [showPointsModal, setShowPointsModal] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [pointsToAdd, setPointsToAdd] = useState('');
    const [submittingPoints, setSubmittingPoints] = useState(false);

    const [showSidebar, setShowSidebar] = useState(false);
    
    const userType = localStorage.getItem('tipo_usuario');
    const playerNameLS = localStorage.getItem('user_name');
    const clubName = localStorage.getItem('club_name');
    const token = localStorage.getItem('token');

    // Función para obtener los datos del ranking
    const fetchRanking = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filterCategory) {
                params.append('category_id', filterCategory);
            }
            if (filterPlayerName) {
                params.append('player_name', filterPlayerName);
            }
            
            const response = await fetch(`${API_URL}ranking?${params.toString()}`);
            if (!response.ok) {
                throw new Error('No se pudo cargar el ranking.');
            }
            const data = await response.json();
            setRanking(data);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
            });
            setRanking([]);
        } finally {
            setLoading(false);
        }
    };
    
    // useEffect para obtener las categorías solo una vez al inicio
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_URL}categories`);
                if (!response.ok) {
                    throw new Error('No se pudo cargar la lista de categorías.');
                }
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message,
                });
            }
        };
        fetchCategories();
    }, []);

    // useEffect que llama a fetchRanking cuando los filtros cambian, pero solo si ya se ha realizado una búsqueda
    useEffect(() => {
      if (hasSearched) {
        fetchRanking();
      }
    }, [filterCategory, filterPlayerName, hasSearched]);

    const handleFilterClick = () => {
        setHasSearched(true);
        setFilterCategory(selectedCategory);
        setFilterPlayerName(playerName);
    };

    const handleClearFilters = () => {
        setSelectedCategory('');
        setPlayerName('');
        setFilterCategory('');
        setFilterPlayerName('');
        setHasSearched(false);
        setRanking([]);
    };

    // Funciones para manejar la modal
    const handleShowModal = (player) => {
        setSelectedPlayer(player);
        setPointsToAdd('');
        setShowPointsModal(true);
    };

    const handleCloseModal = () => {
        setShowPointsModal(false);
        setSelectedPlayer(null);
    };

    const handlePointsSubmit = async (e) => {
        e.preventDefault();
        setSubmittingPoints(true);
        
        try {
            const response = await fetch(`${API_URL}ranking/add-points`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_jugador: selectedPlayer.ID,
                    id_categoria: selectedPlayer.ID_CATEGORIA, // <-- Se agrega la categoría aquí
                    puntos: pointsToAdd
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al registrar los puntos.');
            }
            
            Swal.fire({
                icon: 'success',
                title: 'Puntos registrados',
                text: 'Los puntos se han registrado con éxito.',
            });
            
            handleCloseModal();
            fetchRanking();
            
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
            });
        } finally {
            setSubmittingPoints(false);
        }
    };

    const getSidebarComponent = (type) => {
        switch (type) {
            case '1':
                return <SuperAdminSidebar />;
            case '2':
                return <ClubAdminSidebar clubName ={clubName}/>;
            case '3':
                return <PlayerSidebar playerName={playerNameLS} />;
            default:
                return null;
        }
    };

    const columns = [
        {
            name: '#',
            selector: row => row.posicion,
            sortable: false,
            width: '60px',
        },
        {
            name: 'Nombre',
            selector: row => row.NOMBRE,
            sortable: true,
        },
        {
            name: 'Categoría',
            selector: row => row.categoria_nombre ? `${row.categoria_nombre} ${row.categoria_genero}` : 'N/A',
            sortable: true,
        },
        {
            name: 'Puntos',
            selector: row => row.PUNTOS,
            sortable: true,
        },
        {
            name: 'Última Actualización',
            selector: row => row.updated_at ? new Date(row.updated_at).toLocaleDateString('es-ES') : 'N/A',
            sortable: true,
        },
    ];

    if (userType === '2') {
        columns.push({
            name: 'Acciones',
            cell: row => (
                <Button variant="success" size="sm" onClick={() => handleShowModal(row)}>
                    Otorgar Puntos
                </Button>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: '150px'
        });
    }

    const subHeaderComponentMemo = React.useMemo(() => {
        return (
            <Form className="w-100 d-flex flex-wrap align-items-center">
                <Form.Group className="mb-2 me-2">
                    <Form.Control
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-2 me-2">
                    <Form.Control as="select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        <option value="">Todas las Categorías</option>
                        {categories.map((cat) => (
                            <option key={cat.ID} value={cat.ID}>{`${cat.NOMBRE} ${cat.GENERO}`}</option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <Button variant="primary" onClick={handleFilterClick} className="mb-2 me-2">
                    Filtrar
                </Button>
                <Button variant="outline-secondary" onClick={handleClearFilters} className="mb-2">
                    Limpiar Filtros
                </Button>
            </Form>
        );
    }, [playerName, selectedCategory, categories]);

    return (
        <Container fluid className="p-0">
            <Row className="g-0 h-100">
                {userType && (
                    <Col md={2} className="d-none d-md-block p-0 h-100">
                        {getSidebarComponent(userType)}
                    </Col>
                )}
                <Col xs={12} md={userType ? 10 : 12} className="p-0 h-100">
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
                        <h1 className="mb-4">Ranking de Jugadores</h1>
                        <Card>
                            <Card.Body>
                                {subHeaderComponentMemo}
                                {!hasSearched && (
                                    <div className="text-center mt-3">
                                        <p>Utiliza los filtros para ver el ranking de jugadores.</p>
                                    </div>
                                )}
                                {hasSearched && loading ? (
                                    <div className="text-center mt-3">
                                        <Spinner animation="border" role="status">
                                            <span className="visually-hidden">Cargando...</span>
                                        </Spinner>
                                    </div>
                                ) : hasSearched && ranking.length === 0 ? (
                                    <div className="text-center mt-3">
                                        <p>No hay jugadores que coincidan con los filtros.</p>
                                    </div>
                                ) : hasSearched && (
                                    <DataTable
                                        columns={columns}
                                        data={ranking}
                                        pagination
                                        subHeader={false}
                                        striped
                                        highlightOnHover
                                    />
                                )}
                            </Card.Body>
                        </Card>
                    </div>
                </Col>
            </Row>

            {/* Modal para otorgar puntos */}
            <Modal show={showPointsModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Otorgar Puntos a {selectedPlayer?.NOMBRE}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handlePointsSubmit}>
                    <Modal.Body>
                        <Form.Group controlId="formPoints">
                            <Form.Label>Puntos a agregar</Form.Label>
                            <Form.Control
                                type="number"
                                value={pointsToAdd}
                                onChange={(e) => setPointsToAdd(e.target.value)}
                                min="1"
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal} disabled={submittingPoints}>
                            Cancelar
                        </Button>
                        <Button variant="primary" type="submit" disabled={submittingPoints}>
                            {submittingPoints ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                    Guardando...
                                </>
                            ) : (
                                'Guardar Puntos'
                            )}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default Ranking;