import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import logo from '../assets/logo-matchcup.png';

const PlayerRegister = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [categories, setCategories] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedPosition, setSelectedPosition] = useState('');
    const [selectedClub, setSelectedClub] = useState('');
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL;
    const positions = ['Derecha', 'Reves', 'Ambas'];

    useEffect(() => {
        const fetchSelectData = async () => {
            try {
                const statesResponse = await fetch(`${API_URL}states`);
                const statesData = await statesResponse.json();
                setStates(statesData);

                const categoriesResponse = await fetch(`${API_URL}categories`);
                const categoriesData = await categoriesResponse.json();
                setCategories(categoriesData);

                const clubsResponse = await fetch(`${API_URL}clubs`);
                const clubsData = await clubsResponse.json();
                setClubs(clubsData);
            } catch (error) {
                console.error('Error al obtener datos de selectores:', error);
            }
        };
        fetchSelectData();
    }, [API_URL]);

    useEffect(() => {
        if (selectedState) {
            const fetchCities = async () => {
                try {
                    const citiesResponse = await fetch(`${API_URL}cities/${selectedState}`);
                    const citiesData = await citiesResponse.json();
                    setCities(citiesData);
                } catch (error) {
                    console.error('Error al obtener ciudades:', error);
                }
            };
            fetchCities();
        } else {
            setCities([]);
            setSelectedCity('');
        }
    }, [selectedState, API_URL]);
    
    const handleFileChange = (e) => {
        setProfilePhoto(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('nombre', name);
        formData.append('celular', phone);
        formData.append('estado_id', selectedState);
        formData.append('ciudad_id', selectedCity);
        formData.append('categoria_id', selectedCategory);
        formData.append('posicion', selectedPosition);
        formData.append('club_id', selectedClub);
        if (profilePhoto) {
            formData.append('foto_perfil', profilePhoto);
        }

        try {
            const response = await fetch(`${API_URL}player/register`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessages = Object.values(data.errors).flat().join('<br>');
                throw new Error(errorMessages || data.message || 'Error al registrar el jugador');
            }

            Swal.fire({
                icon: 'success',
                title: '¡Registro Exitoso!',
                html: 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
            });

            navigate('/player/login');

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                html: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="my-5" style={{ minHeight: '100vh' }}>
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow-lg">
                        <Card.Body>
                            <div className="text-center mb-4">
                                <img src={logo} alt="Logo de matchcup, sitio web de pádel" className="img-fluid" style={{ maxWidth: '250px' }} />
                                <h2 style={{ marginTop: '-5% !important' }}>Registro de Jugador</h2>
                            </div>
                            <Form onSubmit={handleSubmit}>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="formPlayerName">
                                            <Form.Label>Nombre Completo</Form.Label>
                                            <Form.Control type="text" placeholder="Ej. Juan Pérez" value={name} onChange={(e) => setName(e.target.value)} required />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="formPlayerEmail">
                                            <Form.Label>Correo Electrónico</Form.Label>
                                            <Form.Control type="email" placeholder="Ingresa tu correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="formPlayerPassword">
                                            <Form.Label>Contraseña</Form.Label>
                                            <Form.Control type="password" placeholder="Mínimo 8 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="formPlayerPhone">
                                            <Form.Label>Celular</Form.Label>
                                            <Form.Control type="tel" placeholder="Ej. 55-1234-5678" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="formPlayerState">
                                            <Form.Label>Estado</Form.Label>
                                            <Form.Control as="select" value={selectedState} onChange={(e) => setSelectedState(e.target.value)} required>
                                                <option value="">Seleccione un estado</option>
                                                {states.map((state) => (
                                                    <option key={state.ID} value={state.ID}>{state.NOMBRE}</option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="formPlayerCity">
                                            <Form.Label>Ciudad</Form.Label>
                                            <Form.Control as="select" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} required disabled={!selectedState}>
                                                <option value="">Seleccione una ciudad</option>
                                                {cities.map((city) => (
                                                    <option key={city.ID} value={city.ID}>{city.NOMBRE}</option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="formPlayerCategory">
                                            <Form.Label>Categoría</Form.Label>
                                            <Form.Control as="select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} required>
                                                <option value="">Seleccione una categoría</option>
                                                {categories.map((category) => (
                                                    <option key={category.ID} value={category.ID}>{category.NOMBRE} - {category.GENERO}</option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="formPlayerPosition">
                                            <Form.Label>Posición en Cancha</Form.Label>
                                            <Form.Control as="select" value={selectedPosition} onChange={(e) => setSelectedPosition(e.target.value)} required>
                                                <option value="">Seleccione una posición</option>
                                                {positions.map((position) => (
                                                    <option key={position} value={position}>{position}</option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="formPlayerClub">
                                            <Form.Label>Club de Preferencia (Opcional)</Form.Label>
                                            <Form.Control as="select" value={selectedClub} onChange={(e) => setSelectedClub(e.target.value)}>
                                                <option value="">Seleccione un club</option>
                                                {clubs.map((club) => (
                                                    <option key={club.ID} value={club.ID}>{club.NOMBRE}</option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="formProfilePhoto">
                                            <Form.Label>Foto de Perfil (Opcional)</Form.Label>
                                            <Form.Control type="file" onChange={handleFileChange} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                
                                <div className="d-grid gap-2">
                                    <Button variant="primary" type="submit" disabled={loading}>
                                        {loading ? (
                                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                        ) : (
                                            'Registrarse'
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default PlayerRegister;