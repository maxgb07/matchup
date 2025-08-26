import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Table, Carousel } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faSignInAlt, faTrophy } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/logo-matchup.png';

const API_URL = import.meta.env.VITE_API_URL;

const HomePage = () => {
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const response = await fetch(`${API_URL}ranking`);
                if (!response.ok) {
                    throw new Error('No se pudo cargar el ranking.');
                }
                const data = await response.json();
                setRanking(data);
            } catch (error) {
                console.error('Error al cargar el ranking:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRanking();
    }, []);

    // Agrupa a los jugadores por género y luego por categoría
    const groupedRanking = ranking.reduce((acc, player) => {
        const genero = player.categoria?.GENERO || 'Sin Género';
        const categoriaID = player.categoria?.ID || 'Sin ID';

        if (!acc[genero]) {
            acc[genero] = {};
        }
        if (!acc[genero][categoriaID]) {
            acc[genero][categoriaID] = {
                nombre: `${player.categoria?.NOMBRE} - ${genero}`,
                players: [],
            };
        }
        acc[genero][categoriaID].players.push(player);
        return acc;
    }, {});

    return (
        <Container fluid className="p-0 overflow-x-hidden">
            {/* Contenedor de botones en la esquina superior derecha */}
            <Row className="g-0 justify-content-end p-3">
                <Col xs="auto">
                    <Button variant="primary" size="sm" as={NavLink} to="/player/register" className="me-2">
                        <FontAwesomeIcon icon={faUserPlus} className="me-1" /> Registrarse
                    </Button>
                    <Button variant="success" size="sm" as={NavLink} to="/player/login" className="me-2">
                        <FontAwesomeIcon icon={faSignInAlt} className="me-1" /> Login Jugador
                    </Button>
                    <Button variant="info" size="sm" as={NavLink} to="/club-admin/login" className="text-white">
                        <FontAwesomeIcon icon={faTrophy} className="me-1" /> Login Club
                    </Button>
                </Col>
            </Row>

            {/* Contenido principal */}
            <Row className="g-0 justify-content-center text-center">
                <Col md={12}>
                    <img src={logo} alt="Logo de MATCHUP, sitio web de pádel" className="img-fluid" style={{ maxWidth: '400px', marginTop: '-5%' }} />
                    <p className="lead text-muted" style={{ marginTop: '-5%' }}>
                        Descubre a los mejores jugadores en cada categoría.
                    </p>
                </Col>
            </Row>

            {/* Sección de Rankings con sliders dobles */}
            <Row className="justify-content-center">
                {loading ? (
                    <div className="text-center my-5">
                        <Spinner animation="border" role="status" />
                        <p className="mt-2">Cargando rankings...</p>
                    </div>
                ) : (
                    <>
                        {/* Ranking Varonil */}
                        <Col md={6} className="mb-4">
                            <h2 className="text-center mb-4">Varonil</h2>
                            <Carousel indicators={false} controls={true} className="carousel-dark">
                                {Object.keys(groupedRanking['VARONIL'] || {})
                                    .sort((a, b) => a - b)
                                    .map(categoryId => {
                                        const category = groupedRanking['VARONIL'][categoryId];
                                        return (
                                            <Carousel.Item key={categoryId}>
                                                <Card className="shadow-sm mx-auto" style={{ maxWidth: '400px', minHeight: '400px' }}>
                                                    <Card.Header className="text-center h5">{category.nombre}</Card.Header>
                                                    <Card.Body>
                                                        <Table responsive hover size="sm" className="mb-0">
                                                            <thead>
                                                                <tr>
                                                                    <th>#</th>
                                                                    <th>Jugador</th>
                                                                    <th>Puntos</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {category.players.slice(0, 10).map((player, index) => (
                                                                    <tr key={player.ID}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{player.jugador?.NOMBRE}</td>
                                                                        <td>{player.PUNTOS}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </Table>
                                                    </Card.Body>
                                                </Card>
                                            </Carousel.Item>
                                        );
                                    })}
                            </Carousel>
                        </Col>

                        {/* Ranking Femenil */}
                        <Col md={6} className="mb-4">
                            <h2 className="text-center mb-4">Femenil</h2>
                            <Carousel indicators={false} controls={true} className="carousel-dark">
                                {Object.keys(groupedRanking['FEMENIL'] || {})
                                    .sort((a, b) => a - b)
                                    .map(categoryId => {
                                        const category = groupedRanking['FEMENIL'][categoryId];
                                        return (
                                            <Carousel.Item key={categoryId}>
                                                <Card className="shadow-sm mx-auto" style={{ maxWidth: '400px', minHeight: '400px' }}>
                                                    <Card.Header className="text-center h5">{category.nombre}</Card.Header>
                                                    <Card.Body>
                                                        <Table responsive hover size="sm" className="mb-0">
                                                            <thead>
                                                                <tr>
                                                                    <th>#</th>
                                                                    <th>Jugador</th>
                                                                    <th>Puntos</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {category.players.slice(0, 10).map((player, index) => (
                                                                    <tr key={player.ID}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{player.jugador?.NOMBRE}</td>
                                                                        <td>{player.PUNTOS}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </Table>
                                                    </Card.Body>
                                                </Card>
                                            </Carousel.Item>
                                        );
                                    })}
                            </Carousel>
                        </Col>
                    </>
                )}
            </Row>
        </Container>
    );
};

export default HomePage;