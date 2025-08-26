import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Button, Offcanvas, Form, Modal, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ClubAdminSidebar from '../components/ClubAdminSidebar';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faEye } from '@fortawesome/free-solid-svg-icons';

// Importación de la nueva librería
import DataTable from 'react-data-table-component';

const PlayersList = () => {
    // La lista de jugadores que se muestra en la tabla (ya filtrados por la API)
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    // Lista de todas las categorías disponibles para el filtro
    const [categories, setCategories] = useState([]);

    // Estados para los valores de los inputs del formulario de filtro
    const [playerNameInput, setPlayerNameInput] = useState('');
    const [selectedCategoryInput, setSelectedCategoryInput] = useState('');

    // Estados que activan la petición a la API con los filtros
    const [filterPlayerName, setFilterPlayerName] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    // Estados para el sidebar móvil y la modal de detalles del jugador
    const [showSidebar, setShowSidebar] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    const navigate = useNavigate();
    const clubName = localStorage.getItem('club_name') || 'Admin del Club';
    const API_URL = import.meta.env.VITE_API_URL;
    // Asumiendo que las fotos de perfil se guardan en la carpeta 'storage' en el backend
    const PROFILE_PHOTO_URL = `${API_URL}storage/`; 

    const handleShowSidebar = () => setShowSidebar(true);
    const handleCloseSidebar = () => setShowSidebar(false);
    
    const handleShowModal = (player) => {
        setSelectedPlayer(player);
        setShowModal(true);
    };
    const handleCloseModal = () => setShowModal(false);

    // --- Efecto para cargar las categorías una vez al montar el componente ---
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
                console.error('Error al cargar categorías:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message,
                });
            }
        };
        fetchCategories();
    }, [API_URL]); // Se ejecuta solo una vez al inicio

    // --- Efecto para cargar los jugadores (con filtros) ---
    useEffect(() => {
        const fetchPlayers = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/club-admin/login');
                setLoading(false);
                return;
            }
            
            try {
                const params = new URLSearchParams();
                if (filterPlayerName) {
                    params.append('player_name', filterPlayerName);
                }
                if (filterCategory) {
                    params.append('category_id', filterCategory);
                }
                
                const response = await fetch(`${API_URL}club-admin/players?${params.toString()}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.status === 401) {
                    navigate('/club-admin/login');
                    return;
                }

                if (!response.ok) {
                    throw new Error('Error al obtener la lista de jugadores.');
                }

                const data = await response.json();
                setPlayers(data); // La API ya devuelve los jugadores filtrados
                
            } catch (error) {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: error.message,
                });
                setPlayers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPlayers();
    }, [API_URL, navigate, filterPlayerName, filterCategory]); // Se activa cuando cambian los filtros

    // --- Funciones para manejar los filtros y el botón ---
    const handleFilterClick = () => {
        setFilterPlayerName(playerNameInput);
        setFilterCategory(selectedCategoryInput);
    };

    const handleClearFilters = () => {
        setPlayerNameInput('');
        setSelectedCategoryInput('');
        setFilterPlayerName(''); // Esto reinicia el filtro y activa la API
        setFilterCategory(''); // Esto reinicia el filtro y activa la API
    };

    // --- Columnas para la tabla DataTable ---
    const columns = [
        { name: 'Nombre', selector: row => row.NOMBRE, sortable: true },
        { name: 'Email', selector: row => row.user?.EMAIL, sortable: true },
        { name: 'Celular', selector: row => row.CELULAR, sortable: true },
        { name: 'Club', selector: row => row.club?.NOMBRE, sortable: true },
        { 
            name: 'Categoría', 
            selector: row => (row.categoria ? `${row.categoria.NOMBRE} - ${row.categoria.GENERO}` : 'N/A'), 
            sortable: true 
        },
        { name: 'Posición', selector: row => row.POSICION_CANCHA, sortable: true },
        { 
            name: 'Acciones',
            cell: row => (
                <Button variant="primary" size="sm" onClick={() => handleShowModal(row)}>
                    <FontAwesomeIcon icon={faEye} /> Ver
                </Button>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ];

    // --- Componente para los filtros de la tabla ---
    const subHeaderComponentMemo = React.useMemo(() => {
        return (
            <Form className="w-100 d-flex flex-wrap align-items-center justify-content-start">
                <Form.Group className="mb-2 me-2">
                    <Form.Control
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={playerNameInput}
                        onChange={e => setPlayerNameInput(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-2 me-2">
                    <Form.Control 
                        as="select"
                        value={selectedCategoryInput}
                        onChange={e => setSelectedCategoryInput(e.target.value)}
                    >
                        <option value="">Todas las Categorías</option>
                        {categories.map(cat => (
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
    }, [playerNameInput, selectedCategoryInput, categories, handleFilterClick, handleClearFilters]);
    
    // --- Renderizado del componente ---
    return (
        <Container fluid className="p-0">
            <Row className="g-0 h-100">
                <Col md={2} className="d-none d-md-block p-0 h-100">
                    <ClubAdminSidebar clubName={clubName} />
                </Col>
                <Col xs={12} md={10} className="p-0 h-100">
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
                        <h1 className="mb-4">Lista de Jugadores Registrados</h1>
                        <Card>
                            <Card.Body>
                                {subHeaderComponentMemo} {/* El filtro siempre visible */}
                                {loading ? (
                                    <div className="text-center mt-3">
                                        <Spinner animation="border" role="status">
                                            <span className="visually-hidden">Cargando...</span>
                                        </Spinner>
                                    </div>
                                ) : players.length === 0 ? (
                                    <div className="text-center mt-3">
                                        <p>No hay jugadores que coincidan con los filtros.</p>
                                    </div>
                                ) : (
                                    <DataTable
                                        columns={columns}
                                        data={players}
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

            {/* Modal para ver detalles del jugador */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedPlayer?.NOMBRE}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedPlayer?.FOTO_PERFIL && (
                        <div className="text-center mb-3">
                            <Image 
                                src={`${PROFILE_PHOTO_URL}${selectedPlayer.FOTO_PERFIL}`} 
                                roundedCircle 
                                style={{ width: '150px', height: '150px', objectFit: 'cover' }} 
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150'; }} // Fallback image
                            />
                        </div>
                    )}
                    <p><strong>Email:</strong> {selectedPlayer?.user?.EMAIL}</p>
                    <p><strong>Celular:</strong> {selectedPlayer?.CELULAR}</p>
                    <p><strong>Estado:</strong> {selectedPlayer?.estado?.NOMBRE}</p>
                    <p><strong>Ciudad:</strong> {selectedPlayer?.ciudad?.NOMBRE}</p>
                    <p><strong>Categoría:</strong> {selectedPlayer?.categoria ? `${selectedPlayer.categoria.NOMBRE} - ${selectedPlayer.categoria.GENERO}` : 'N/A'}</p>
                    <p><strong>Posición:</strong> {selectedPlayer?.POSICION_CANCHA}</p>
                    <p><strong>Club:</strong> {selectedPlayer?.club?.NOMBRE}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default PlayersList;