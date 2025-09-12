import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Offcanvas } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ClubAdminSidebar from '../components/ClubAdminSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const CreatePlayer = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  const clubName = localStorage.getItem('club_name') || 'Admin del Club';
  const API_URL = import.meta.env.VITE_API_URL;
  const positions = ['Derecha', 'Reves', 'Ambas'];

  const handleShowSidebar = () => setShowSidebar(true);
  const handleCloseSidebar = () => setShowSidebar(false);

  // Efecto para obtener la lista de estados y categorías al cargar el componente
  useEffect(() => {
    const fetchSelectData = async () => {
      try {
        const statesResponse = await fetch(`${API_URL}states`);
        const statesData = await statesResponse.json();
        setStates(statesData);

        const categoriesResponse = await fetch(`${API_URL}categories`);
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error al obtener datos de selectores:', error);
      }
    };
    fetchSelectData();
  }, [API_URL]);

  // Efecto para obtener las ciudades cuando se selecciona un estado
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/club-admin/login');
        return;
    }

    try {
      const response = await fetch(`${API_URL}club-admin/players/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          state_id: selectedState,
          city_id: selectedCity,
          category_id: selectedCategory,
          position: selectedPosition,
          birth_date: birthDate
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear el jugador');
      }

      Swal.fire({
        icon: 'success',
        title: '¡Jugador Creado!',
        text: data.message,
      });

      // Reiniciar el formulario
      setName('');
      setEmail('');
      setPhone('');
      setSelectedState('');
      setSelectedCity('');
      setSelectedCategory('');
      setSelectedPosition('');
      setBirthDate('');

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
              <Offcanvas.Title>Menú</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="p-0">
              <ClubAdminSidebar onHide={handleCloseSidebar} clubName={clubName} />
            </Offcanvas.Body>
          </Offcanvas>
          <div className="p-4">
            <h1 className="mb-4">Registrar Nuevo Jugador</h1>
            <Card>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  {/* Fila 1: Nombre, Correo y Celular */}
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group controlId="formPlayerName">
                        <Form.Label>Nombre Completo</Form.Label>
                        <Form.Control type="text" placeholder="Ej. Juan Pérez" value={name} onChange={(e) => setName(e.target.value)} required />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="formBirthDate">
                            <Form.Label>Fecha de Nacimiento</Form.Label>
                            <Form.Control 
                                type="date" 
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="formPlayerEmail">
                        <Form.Label>Correo Electrónico</Form.Label>
                        <Form.Control type="email" placeholder="Ej. juan.perez@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="formPlayerPhone">
                        <Form.Label>Celular</Form.Label>
                        <Form.Control type="tel" placeholder="Ej. 55-1234-5678" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Fila 2: Estado y Ciudad */}
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

                  {/* Fila 3: Categoría y Posición */}
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

                  <Row>
                    <Col md={12} className="d-flex justify-content-center">
                      <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? (
                          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                        ) : (
                          'Registrar Jugador'
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

export default CreatePlayer;