// src/pages/TournamentList.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Offcanvas, Table, Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ClubAdminSidebar from '../components/ClubAdminSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCalendarAlt, faDollarSign, faEye, faEdit, faTrash, faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

const API_URL = import.meta.env.VITE_API_URL;

const TournamentList = () => {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);
    
    // Estados para los modales
    const [showModal, setShowModal] = useState(false); // Modal de ver
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false); // Modal de editar
    const [editingTournament, setEditingTournament] = useState(null);

    const navigate = useNavigate();
    const clubName = localStorage.getItem('club_name') || 'Admin del Club';
    const clubId = localStorage.getItem('id_club');
    const token = localStorage.getItem('token'); 

    const [allCategories, setAllCategories] = useState([]);
    const [editFormLoading, setEditFormLoading] = useState(false);

    const handleShowSidebar = () => setShowSidebar(true);
    const handleCloseSidebar = () => setShowSidebar(false);

    // Funciones para el modal de Ver
    const handleShowModal = (tournament) => {
        setSelectedTournament(tournament);
        setShowModal(true);
    };
    const handleCloseModal = () => setShowModal(false);

    // Funciones para el modal de Editar
    const handleShowEditModal = (torneo) => {
        setEditingTournament({
            ...torneo,
            categorias: torneo.categorias.map(cat => ({
                ID_CATEGORIA: cat.ID,
                CUPO_PAREJAS: cat.pivot.CUPO_PAREJAS,
                NOMBRE: cat.NOMBRE,
                GENERO: cat.GENERO
            }))
        });
        setShowEditModal(true);
    };
    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditingTournament(null);
    };

    const fetchTournaments = async () => {
        if (!token || !clubId) {
            Swal.fire('Error', 'No se pudo obtener el ID del club o el token.', 'error');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}tournaments/by-club`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ ID_CLUB: clubId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al cargar los torneos.');
            }

            const data = await response.json();
            setTournaments(data);
        } catch (err) {
            setError(err.message);
            Swal.fire('Error', err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchAllCategories = async () => {
        try {
            const response = await fetch(`${API_URL}categories`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Error al cargar las categorías');
            }
            const data = await response.json();
            setAllCategories(data);
        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar las categorías para la edición.', 'error');
        }
    };

    useEffect(() => {
        fetchTournaments();
        fetchAllCategories();
    }, [clubId, token]);

    const handleDelete = async (torneoId) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${API_URL}tournaments/${torneoId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error al eliminar el torneo.');
                }

                Swal.fire('¡Eliminado!', 'El torneo ha sido eliminado.', 'success');
                fetchTournaments(); // Actualiza la lista principal para reflejar el soft delete
            } catch (err) {
                Swal.fire('Error', err.message, 'error');
            }
        }
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditingTournament(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCategoryChange = (index, e) => {
        const { name, value } = e.target;
        const newCategories = [...editingTournament.categorias];
        newCategories[index] = { ...newCategories[index], [name]: value };
        
        // Cargar el nombre y género de la categoría seleccionada
        if (name === 'ID_CATEGORIA') {
            const selectedCat = allCategories.find(cat => cat.ID === parseInt(value));
            if (selectedCat) {
                newCategories[index].NOMBRE = selectedCat.NOMBRE;
                newCategories[index].GENERO = selectedCat.GENERO;
            }
        }
        
        setEditingTournament(prev => ({ ...prev, categorias: newCategories }));
    };

    const handleAddCategory = () => {
        setEditingTournament(prev => ({
            ...prev,
            categorias: [...prev.categorias, { ID_CATEGORIA: '', CUPO_PAREJAS: 1 }]
        }));
    };

    const handleRemoveCategory = (index) => {
        setEditingTournament(prev => {
            const newCategories = [...prev.categorias];
            newCategories.splice(index, 1);
            return { ...prev, categorias: newCategories };
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setEditFormLoading(true);
        try {
            const response = await fetch(`${API_URL}tournaments/${editingTournament.ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    NOMBRE: editingTournament.NOMBRE,
                    DESCRIPCION: editingTournament.DESCRIPCION,
                    FECHA_INICIO: editingTournament.FECHA_INICIO,
                    FECHA_FIN: editingTournament.FECHA_FIN,
                    FECHA_INSCRIPCION_LIMITE: editingTournament.FECHA_INSCRIPCION_LIMITE,
                    COSTO_POR_PAREJA: editingTournament.COSTO_POR_PAREJA,
                    categorias: editingTournament.categorias.map(cat => ({
                        ID_CATEGORIA: parseInt(cat.ID_CATEGORIA),
                        CUPO_PAREJAS: parseInt(cat.CUPO_PAREJAS)
                    }))
                }),
            });

            const data = await response.json();
            
            if (!response.ok) {
                const errorMsg = data.errors ? Object.values(data.errors).flat().join('\n') : data.message;
                throw new Error(errorMsg || 'Error al actualizar el torneo.');
            }
            
            Swal.fire('¡Actualizado!', data.message, 'success');
            handleCloseEditModal();
            fetchTournaments(); // Actualiza la lista principal
        } catch (err) {
            Swal.fire('Error', err.message, 'error');
        } finally {
            setEditFormLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

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
                            <Offcanvas.Title>Menú del Administrador</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body className="p-0">
                            <ClubAdminSidebar onHide={handleCloseSidebar} clubName={clubName} />
                        </Offcanvas.Body>
                    </Offcanvas>
                    <div className="p-4">
                        <h1 className="mb-4">Torneos Registrados</h1>
                        {loading ? (
                            <div className="d-flex justify-content-center mt-5">
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </Spinner>
                            </div>
                        ) : error ? (
                            <p className="text-danger text-center mt-5">Error: {error}</p>
                        ) : tournaments.length > 0 ? (
                            <Card>
                                <Card.Body>
                                    <Table responsive bordered hover className="mb-0">
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Fechas</th>
                                                <th>Costo por Pareja</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tournaments.map((torneo) => (
                                                <tr key={torneo.ID}>
                                                    <td>{torneo.NOMBRE}</td>
                                                    <td>
                                                        <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                                                        {formatDate(torneo.FECHA_INICIO)} - {formatDate(torneo.FECHA_FIN)}
                                                    </td>
                                                    <td>
                                                        <FontAwesomeIcon icon={faDollarSign} className="me-2" />
                                                        ${torneo.COSTO_POR_PAREJA}
                                                    </td>
                                                    <td className="d-flex flex-nowrap align-items-center gap-2">
                                                        <Button variant="info" size="sm" onClick={() => handleShowModal(torneo)}>
                                                            <FontAwesomeIcon icon={faEye} className="text-white" />
                                                        </Button>
                                                        <Button variant="warning" size="sm" onClick={() => handleShowEditModal(torneo)}>
                                                            <FontAwesomeIcon icon={faEdit} className="text-white" />
                                                        </Button>
                                                        <Button variant="danger" size="sm" onClick={() => handleDelete(torneo.ID)}>
                                                            <FontAwesomeIcon icon={faTrash} className="text-white" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        ) : (
                            <div className="text-center p-5">
                                <p>No has creado ningún torneo aún.</p>
                                <Button variant="primary" onClick={() => navigate('/club-admin/CreateTournament')}>
                                    Crear mi primer torneo
                                </Button>
                            </div>
                        )}
                    </div>
                </Col>
            </Row>

            {/* Modal para ver detalles del torneo */}
            {selectedTournament && (
                <Modal show={showModal} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedTournament.NOMBRE}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>Descripción:</strong> {selectedTournament.DESCRIPCION || 'N/A'}</p>
                        <p><strong>Fechas:</strong> {formatDate(selectedTournament.FECHA_INICIO)} - {formatDate(selectedTournament.FECHA_FIN)}</p>
                        <p><strong>Fecha límite de inscripción:</strong> {formatDate(selectedTournament.FECHA_INSCRIPCION_LIMITE)}</p>
                        <p><strong>Costo por pareja:</strong> ${selectedTournament.COSTO_POR_PAREJA}</p>
                        
                        <h5>Categorías:</h5>
                        {selectedTournament.categorias && selectedTournament.categorias.length > 0 ? (
                            <Table striped bordered hover size="sm">
                                <thead>
                                    <tr>
                                        <th>Categoría y Género</th>
                                        <th>Cupos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedTournament.categorias.map((categoria, index) => (
                                        <tr key={index}>
                                            <td>{categoria.NOMBRE} ({categoria.GENERO})</td>
                                            <td>{categoria.pivot.CUPO_PAREJAS}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <p>No se han registrado categorías para este torneo.</p>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

            {/* Modal para editar torneo */}
            {editingTournament && (
                <Modal show={showEditModal} onHide={handleCloseEditModal} size="xl" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Editar Torneo</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleEditSubmit}>
                            <Row className="mb-3">
                                <Col md={4}>
                                    <Form.Group controlId="editNombre">
                                        <Form.Label>Nombre del Torneo</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="NOMBRE" 
                                            value={editingTournament.NOMBRE} 
                                            onChange={handleEditFormChange} 
                                            required 
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group controlId="editFechaInicio">
                                        <Form.Label>Fecha de Inicio</Form.Label>
                                        <Form.Control 
                                            type="date" 
                                            name="FECHA_INICIO" 
                                            value={editingTournament.FECHA_INICIO ? editingTournament.FECHA_INICIO.split('T')[0] : ''} 
                                            onChange={handleEditFormChange} 
                                            required 
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group controlId="editFechaFin">
                                        <Form.Label>Fecha de Fin</Form.Label>
                                        <Form.Control 
                                            type="date" 
                                            name="FECHA_FIN" 
                                            value={editingTournament.FECHA_FIN ? editingTournament.FECHA_FIN.split('T')[0] : ''} 
                                            onChange={handleEditFormChange} 
                                            required 
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group controlId="editFechaLimite">
                                        <Form.Label>Fecha Límite de Inscripción</Form.Label>
                                        <Form.Control 
                                            type="date" 
                                            name="FECHA_INSCRIPCION_LIMITE" 
                                            value={editingTournament.FECHA_INSCRIPCION_LIMITE ? editingTournament.FECHA_INSCRIPCION_LIMITE.split('T')[0] : ''} 
                                            onChange={handleEditFormChange} 
                                            required 
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="editCosto">
                                        <Form.Label>Costo por Pareja</Form.Label>
                                        <Form.Control 
                                            type="number" 
                                            name="COSTO_POR_PAREJA" 
                                            value={editingTournament.COSTO_POR_PAREJA} 
                                            onChange={handleEditFormChange} 
                                            required 
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={12}>
                                    <Form.Group controlId="editDescripcion">
                                        <Form.Label>Descripción</Form.Label>
                                        <Form.Control 
                                            as="textarea"
                                            rows={3} 
                                            name="DESCRIPCION" 
                                            value={editingTournament.DESCRIPCION || ''} 
                                            onChange={handleEditFormChange} 
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                            <hr />
                            <h5>Categorías del Torneo</h5>
                            {editingTournament.categorias.map((categoria, index) => (
                                <Row key={index} className="mb-3 align-items-end">
                                    <Col md={6}>
                                        <Form.Group controlId={`categoria-${index}`}>
                                            <Form.Label>Categoría</Form.Label>
                                            <Form.Control
                                                as="select"
                                                name="ID_CATEGORIA"
                                                value={categoria.ID_CATEGORIA}
                                                onChange={(e) => handleCategoryChange(index, e)}
                                                required
                                            >
                                                <option value="">Seleccione una categoría</option>
                                                {allCategories.map(cat => (
                                                    <option key={cat.ID} value={cat.ID}>
                                                        {cat.NOMBRE} ({cat.GENERO})
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group controlId={`cupo-${index}`}>
                                            <Form.Label>Cupo de Parejas</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="CUPO_PAREJAS"
                                                value={categoria.CUPO_PAREJAS}
                                                onChange={(e) => handleCategoryChange(index, e)}
                                                min="1"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={2} className="d-flex align-items-center">
                                        <Button variant="danger" onClick={() => handleRemoveCategory(index)} disabled={editingTournament.categorias.length === 1}>
                                            <FontAwesomeIcon icon={faMinusCircle} className="text-white" />
                                        </Button>
                                    </Col>
                                </Row>
                            ))}
                            <Button variant="outline-primary" onClick={handleAddCategory} className="mb-3">
                                <FontAwesomeIcon icon={faPlusCircle} className="me-2" />
                                Agregar Categoría
                            </Button>
                            
                            <hr />
                            <div className="d-grid gap-2">
                                <Button variant="success" type="submit" disabled={editFormLoading}>
                                    {editFormLoading ? (
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                    ) : (
                                        'Guardar Cambios'
                                    )}
                                </Button>
                                <Button variant="secondary" onClick={handleCloseEditModal}>
                                    Cancelar
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>
            )}
        </Container>
    );
};

export default TournamentList;