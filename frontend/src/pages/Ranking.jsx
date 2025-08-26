// En frontend/src/pages/Ranking.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Spinner, Button, Offcanvas } from 'react-bootstrap';
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
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    
    // Estados para los campos del formulario
    const [selectedCategory, setSelectedCategory] = useState('');
    const [playerName, setPlayerName] = useState('');
    
    // Estados que activan la búsqueda al hacer clic en el botón
    const [filterCategory, setFilterCategory] = useState('');
    const [filterPlayerName, setFilterPlayerName] = useState('');

    const [showSidebar, setShowSidebar] = useState(false);
    
    const userType = localStorage.getItem('tipo_usuario');
    const playerNameLS = localStorage.getItem('user_name');
    const clubName = localStorage.getItem('club_name');

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

        fetchCategories();
        fetchRanking();
    }, [filterCategory, filterPlayerName]);

    const handleFilterClick = () => {
        setFilterCategory(selectedCategory);
        setFilterPlayerName(playerName);
    };

    const handleClearFilters = () => {
        setSelectedCategory('');
        setPlayerName('');
        setFilterCategory('');
        setFilterPlayerName('');
    };

    const getSidebarComponent = (type) => {
        switch (type) {
            case '1': // Súper Administrador
                return <SuperAdminSidebar />;
            case '2': // Administrador de Club
                return <ClubAdminSidebar clubName ={clubName}/>;
            case '3': // Jugador
                return <PlayerSidebar playerName={playerNameLS} />;
            default:
                return null;
        }
    };

    const columns = [
        {
            name: '#',
            selector: (row, index) => index + 1,
            sortable: false,
            width: '60px',
        },
        {
            name: 'Nombre',
            selector: row => row.jugador?.NOMBRE,
            sortable: true,
        },
        {
            name: 'Categoría',
            selector: row => `${row.categoria?.NOMBRE} ${row.categoria?.GENERO}`,
            sortable: true,
        },
        {
            name: 'Puntos',
            selector: row => row.PUNTOS,
            sortable: true,
        },
        {
            name: 'Última Actualización',
            selector: row => new Date(row.updated_at).toLocaleDateString('es-ES'),
            sortable: true,
        },
    ];

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
                                {loading ? (
                                    <div className="text-center mt-3">
                                        <Spinner animation="border" role="status">
                                            <span className="visually-hidden">Cargando...</span>
                                        </Spinner>
                                    </div>
                                ) : ranking.length === 0 ? (
                                    <div className="text-center mt-3">
                                        <p>No hay jugadores en el ranking.</p>
                                    </div>
                                ) : (
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
        </Container>
    );
};

export default Ranking;