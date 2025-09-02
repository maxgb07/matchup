import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Offcanvas, Alert } from 'react-bootstrap';
import Swal from 'sweetalert2';
import ClubAdminSidebar from '../components/ClubAdminSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const CreateTournament = () => {
    const [nombre, setNombre] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [costoInscripcion, setCostoInscripcion] = useState(''); // Nuevo estado para el costo
    const [categorias, setCategorias] = useState([]);
    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
    const [rondas, setRondas] = useState([]);
    const [configGrupos, setConfigGrupos] = useState({});
    const [loading, setLoading] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [apiError, setApiError] = useState('');

    const clubName = localStorage.getItem('club_name') || 'Admin del Club';
    const id_club = localStorage.getItem('id_club') || 0;
    const API_URL = import.meta.env.VITE_API_URL;

    const defaultRounds = [
        { nombre: 'Fase de grupos', puntos: '' },
        { nombre: 'Ronda de 16', puntos: '' },
        { nombre: 'Octavos de final', puntos: '' },
        { nombre: 'Cuartos de final', puntos: '' },
        { nombre: 'Semifinal', puntos: '' },
        { nombre: 'Final', puntos: '' },
        { nombre: 'Campeón', puntos: '' },
    ];

    const handleShowSidebar = () => setShowSidebar(true);
    const handleCloseSidebar = () => setShowSidebar(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_URL}categories`);
                const data = await response.json();
                if (response.ok) {
                    setCategorias(data);
                    setRondas(defaultRounds);
                } else {
                    throw new Error(data.message || 'Error al obtener las categorías.');
                }
            } catch (error) {
                setApiError(error.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Conexión',
                    text: 'No se pudieron cargar las categorías. Inténtelo de nuevo más tarde.',
                });
            }
        };
        fetchCategories();
    }, [API_URL]);

    const handleRondaChange = (index, e) => {
        const newRondas = [...rondas];
        newRondas[index].puntos = e.target.value;
        setRondas(newRondas);
    };

    const handleCategoriaChange = (e) => {
        const { options } = e.target;
        const selected = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selected.push(options[i].value);
            }
        }
        setCategoriasSeleccionadas(selected);
    };

    const handleConfigGruposChange = (categoriaId, campo, valor) => {
        setConfigGrupos(prevState => ({
            ...prevState,
            [categoriaId]: {
                ...prevState[categoriaId],
                [campo]: valor
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setApiError('');
        
        const torneoData = {
            id_club,
            nombre,
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
            costo: costoInscripcion, // Incluye el nuevo estado en los datos a enviar
            categorias: categoriasSeleccionadas,
            config_grupos: configGrupos,
            rondas: rondas.map(r => ({ ...r, puntos: parseInt(r.puntos) }))
        };

        const token = localStorage.getItem('token');
        if (!token) {
            Swal.fire({
                icon: 'error',
                title: 'Error de Autenticación',
                text: 'No se encontró el token de acceso. Por favor, inicie sesión.',
            });
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}club-admin/torneos/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(torneoData),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Error al crear el torneo.');
            }

            Swal.fire({
                icon: 'success',
                title: '¡Torneo Creado!',
                text: data.message || 'El torneo ha sido creado con éxito.',
            });

            // Limpiar los campos del formulario
            setNombre('');
            setFechaInicio('');
            setFechaFin('');
            setCostoInscripcion(''); // Limpiar el campo del costo
            setCategoriasSeleccionadas([]);
            setRondas(defaultRounds);
            setConfigGrupos({});
        } catch (error) {
            setApiError(error.message);
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
                            <Offcanvas.Title>Menú</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body className="p-0">
                            <ClubAdminSidebar onHide={handleCloseSidebar} clubName={clubName} />
                        </Offcanvas.Body>
                    </Offcanvas>
                    <div className="p-4">
                        <h1 className="mb-4">Crear Nuevo Torneo</h1>
                        <Card>
                            <Card.Body>
                                {apiError && <Alert variant="danger">{apiError}</Alert>}
                                <Form onSubmit={handleSubmit}>
                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <Form.Group controlId="formTournamentName">
                                                <Form.Label>Nombre del Torneo</Form.Label>
                                                <Form.Control type="text" placeholder="Ej. Torneo de Verano" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="formTournamentCost">
                                                <Form.Label>Costo de Inscripción</Form.Label>
                                                <Form.Control type="number" placeholder="Ej. 250" value={costoInscripcion} onChange={(e) => setCostoInscripcion(e.target.value)} required min="0" />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <Form.Group controlId="formStartDate">
                                                <Form.Label>Fecha de Inicio</Form.Label>
                                                <Form.Control type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} required />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="formEndDate">
                                                <Form.Label>Fecha de Fin</Form.Label>
                                                <Form.Control type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} required />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Col md={12}>
                                            <Form.Group controlId="formTournamentCategories">
                                                <Form.Label>Categorías a participar</Form.Label>
                                                <Form.Control as="select" multiple onChange={handleCategoriaChange} value={categoriasSeleccionadas} required>
                                                    <option disabled>Seleccione una o más categorías</option>
                                                    {categorias.map(cat => (
                                                        <option key={cat.ID} value={cat.ID}>
                                                            {cat.NOMBRE} - {cat.GENERO}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                                <Form.Text className="text-muted">
                                                    Mantén presionado `Ctrl` (o `Cmd` en Mac) para seleccionar múltiples categorías.
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    
                                    {categorias.filter(cat => categoriasSeleccionadas.includes(String(cat.ID))).map(cat => (
                                        <Card key={cat.ID} className="mb-3 p-3">
                                            <Card.Title className="mb-3">{`Configuración de Grupos para: ${cat.NOMBRE}`}</Card.Title>
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Número de grupos</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder="Cantidad de grupos"
                                                            value={configGrupos[cat.ID]?.grupos || ''}
                                                            onChange={(e) => handleConfigGruposChange(cat.ID, 'grupos', e.target.value)}
                                                            min="1"
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Parejas por grupo</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder="Parejas por grupo"
                                                            value={configGrupos[cat.ID]?.parejas_por_grupo || ''}
                                                            onChange={(e) => handleConfigGruposChange(cat.ID, 'parejas_por_grupo', e.target.value)}
                                                            min="1"
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Card>
                                    ))}

                                    <h5 className="mt-4 mb-3">Puntos por Ronda</h5>
                                    {rondas.map((ronda, index) => (
                                        <Row className="mb-3" key={index}>
                                            <Col md={6}>
                                                <Form.Label>{ronda.nombre}</Form.Label>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Control 
                                                    type="number" 
                                                    placeholder="Puntos a otorgar"
                                                    value={ronda.puntos}
                                                    onChange={(e) => handleRondaChange(index, e)}
                                                    required
                                                />
                                            </Col>
                                        </Row>
                                    ))}

                                    <Row>
                                        <Col md={12} className="d-flex justify-content-center">
                                            <Button variant="primary" type="submit" disabled={loading}>
                                                {loading ? (
                                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                                ) : (
                                                    'Crear Torneo'
                                                )}
                                            </Button>
                                        </Col>
                                    </Row>
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