// src/pages/CreateTournament.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Offcanvas } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ClubAdminSidebar from '../components/ClubAdminSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

const API_URL = import.meta.env.VITE_API_URL;

const CreateTournament = () => {
    const [tournamentName, setTournamentName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [inscriptionDate, setInscriptionDate] = useState('');
    const [costPerCouple, setCostPerCouple] = useState('');
    const [description, setDescription] = useState(''); // Estado para la descripción
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);

    const navigate = useNavigate();
    const clubName = localStorage.getItem('club_name') || 'Admin del Club';
    const token = localStorage.getItem('token'); // Variable renombrada
    const clubId = localStorage.getItem('id_club'); // Obtiene el ID del club

    const handleShowSidebar = () => setShowSidebar(true);
    const handleCloseSidebar = () => setShowSidebar(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Obtener las categorías sin token
                const response = await fetch(`${API_URL}categories`);
                if (!response.ok) {
                    throw new Error('No se pudo cargar las categorías.');
                }
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                Swal.fire('Error', error.message, 'error');
            }
        };

        fetchCategories();
    }, []); // El useEffect se ejecuta solo una vez al montar el componente

    const handleAddCategory = () => {
        setSelectedCategories([...selectedCategories, { category_id: '', quota: '' }]);
    };

    const handleCategoryChange = (index, event) => {
        const values = [...selectedCategories];
        values[index][event.target.name] = event.target.value;
        setSelectedCategories(values);
    };

    const handleRemoveCategory = (index) => {
        const values = [...selectedCategories];
        values.splice(index, 1);
        setSelectedCategories(values);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const tournamentData = {
            ID_CLUB: clubId, // Nuevo campo
            NOMBRE: tournamentName,
            FECHA_INICIO: startDate,
            FECHA_FIN: endDate,
            FECHA_INSCRIPCION_LIMITE: inscriptionDate,
            COSTO_POR_PAREJA: costPerCouple,
            DESCRIPCION: description,
            CATEGORIAS: selectedCategories
                .filter(cat => cat.category_id !== '' && cat.quota !== '')
                .map(cat => ({
                    ID_CATEGORIA: cat.category_id,
                    CUPO_PAREJAS: cat.quota
                }))
        };

        try {
            const response = await fetch(`${API_URL}tournaments/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(tournamentData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al crear el torneo.');
            }

            Swal.fire({
                icon: 'success',
                title: '¡Torneo Creado!',
                text: 'El torneo ha sido registrado exitosamente.',
            }).then(() => {
                navigate('/club-admin/dashboard');
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.message,
            });
        } finally {
            setLoading(false);
        }
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
                        <h1 className="mb-4">Crear Nuevo Torneo</h1>
                        <Card>
                            <Card.Body>
                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={12}>
                                            <Form.Group className="mb-3" controlId="formTournamentName">
                                                <Form.Label>Nombre del Torneo</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Ingrese el nombre del torneo"
                                                    value={tournamentName}
                                                    onChange={(e) => setTournamentName(e.target.value)}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={4}>
                                            <Form.Group className="mb-3" controlId="formStartDate">
                                                <Form.Label>Fecha de Inicio</Form.Label>
                                                <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3" controlId="formEndDate">
                                                <Form.Label>Fecha de Fin</Form.Label>
                                                <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3" controlId="formInscriptionDate">
                                                <Form.Label>Fecha Límite de Inscripción</Form.Label>
                                                <Form.Control type="date" value={inscriptionDate} onChange={(e) => setInscriptionDate(e.target.value)} required />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={12}>
                                            <Form.Group className="mb-3" controlId="formCostPerCouple">
                                                <Form.Label>Costo por Pareja</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="Ej: 500"
                                                    value={costPerCouple}
                                                    onChange={(e) => setCostPerCouple(e.target.value)}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {/* Campo de comentarios */}
                                    <Row>
                                        <Col md={12}>
                                            <Form.Group className="mb-3" controlId="formDescription">
                                                <Form.Label>Comentarios (Opcional)</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    placeholder="Añade una breve descripción o comentarios sobre el torneo."
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <hr className="my-4" />

                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h4>Categorías del Torneo</h4>
                                        <Button variant="primary" onClick={handleAddCategory}>
                                            <FontAwesomeIcon icon={faPlus} className="me-2" />
                                            Agregar Categoría
                                        </Button>
                                    </div>

                                    {selectedCategories.map((selectedCat, index) => (
                                        <Row key={index} className="mb-3 align-items-end">
                                            <Col md={6}>
                                                <Form.Group controlId={`formCategory${index}`}>
                                                    <Form.Label>Categoría</Form.Label>
                                                    <Form.Control
                                                        as="select"
                                                        name="category_id"
                                                        value={selectedCat.category_id}
                                                        onChange={(e) => handleCategoryChange(index, e)}
                                                        required
                                                    >
                                                        <option value="">Seleccione una categoría</option>
                                                        {categories.map((cat) => (
                                                            <option key={cat.ID} value={cat.ID}>
                                                                {cat.NOMBRE} - {cat.GENERO}
                                                            </option>
                                                        ))}
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group controlId={`formQuota${index}`}>
                                                    <Form.Label>Cupo de Parejas</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        name="quota"
                                                        placeholder="Cupo"
                                                        value={selectedCat.quota}
                                                        onChange={(e) => handleCategoryChange(index, e)}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={2} className="d-flex justify-content-end">
                                                <Button variant="danger" onClick={() => handleRemoveCategory(index)}>
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </Button>
                                            </Col>
                                        </Row>
                                    ))}

                                    <hr className="my-4" />

                                    <div className="d-grid gap-2">
                                        <Button variant="success" type="submit" disabled={loading}>
                                            {loading ? <Spinner animation="border" size="sm" /> : 'Crear Torneo'}
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default CreateTournament;