import React, { useState, useEffect } from 'react';
import { Modal, Button, Spinner, Alert, ListGroup, Card } from 'react-bootstrap';

const TournamentDetailsModal = ({ show, onHide, torneoId }) => {
    const [torneoData, setTorneoData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!torneoId) {
            setTorneoData(null);
            return;
        }

        const fetchDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_URL}torneos/${torneoId}/details`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Error al obtener los detalles del torneo.');
                }
                setTorneoData(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [torneoId, API_URL, token]);

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{torneoData?.NOMBRE || 'Detalles del Torneo'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading && (
                    <div className="text-center">
                        <Spinner animation="border" role="status" />
                        <p>Cargando detalles...</p>
                    </div>
                )}
                {error && <Alert variant="danger">{error}</Alert>}
                {torneoData && !loading && (
                    <>
                        <p><strong>Fecha de inicio:</strong> {torneoData.FECHA_INICIO}</p>
                        <p><strong>Fecha de fin:</strong> {torneoData.FECHA_FIN}</p>
                        <p><strong>Costo de inscripción por pareja:</strong> ${torneoData.COSTO}</p>
                        <p><strong>Estado:</strong> {torneoData.ESTADO}</p>

                        <hr />

                        <h5>Categorías y configuración de grupos</h5>
                        <ListGroup className="mb-4">
                            {torneoData.categorias.map(categoria => (
                                <ListGroup.Item key={categoria.ID}>
                                    <strong>{categoria.NOMBRE} - {categoria.GENERO}</strong>
                                    <div className="mt-2">
                                        <Card>
                                            <Card.Body className="p-2">
                                                <small>Grupos: {categoria.pivot.GRUPOS}</small>
                                                <small className="ms-3">Parejas por grupo: {categoria.pivot.PAREJAS_POR_GRUPO}</small>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>

                        <hr />

                        <h5>Puntos por ronda</h5>
                        <ListGroup>
                            {torneoData.puntos_por_ronda.map(ronda => (
                                <ListGroup.Item key={ronda.ID} className="d-flex justify-content-between">
                                    <span>{ronda.RONDA_NOMBRE}</span>
                                    <strong>{ronda.PUNTOS} puntos</strong>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TournamentDetailsModal;