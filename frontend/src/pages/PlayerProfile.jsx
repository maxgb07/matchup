import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Image, Offcanvas } from 'react-bootstrap';
import PlayerSidebar from '../components/PlayerSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const PlayerProfile = () => {
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const navigate = useNavigate();

  const authToken = localStorage.getItem('auth_token');
  const playerName = localStorage.getItem('user_name');

  const handleShowSidebar = () => setShowSidebar(true);
  const handleCloseSidebar = () => setShowSidebar(false);

  useEffect(() => {
    const fetchPlayerData = async () => {
      if (!authToken) {
        Swal.fire({
          icon: 'error',
          title: 'Error de Autenticación',
          text: 'No tienes acceso a esta sección. Por favor, inicia sesión.',
        }).then(() => navigate('/player/login'));
        return;
      }
      try {
        const response = await fetch(`${API_URL}player/profile`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Accept': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('No se pudo cargar la información del perfil.');
        }
        const data = await response.json();
        setPlayerData(data);
        setEditedData(data);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message,
        });
      }
    };
    fetchPlayerData();
  }, [API_URL, navigate, authToken]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePhoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('nombre', editedData.NOMBRE);
    formData.append('celular', editedData.CELULAR);
    formData.append('posicion_cancha', editedData.POSICION_CANCHA);
    if (profilePhoto) {
      formData.append('foto_perfil', profilePhoto);
    }

    try {
      const response = await fetch(`${API_URL}player/profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar el perfil.');
      }
      Swal.fire({
        icon: 'success',
        title: '¡Actualización Exitosa!',
        text: 'Tu perfil ha sido actualizado.',
      });
      setIsEditing(false);
      setPlayerData(data.player);
      setLoading(false);
      localStorage.setItem('user_name', data.player.NOMBRE);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      });
      setLoading(false);
    }
  };

  const positions = ['Derecha', 'Reves', 'Ambas'];

  if (!playerData) {
    return (
      <div className="p-4 text-center">
        <p>Cargando información del perfil...</p>
      </div>
    );
  }

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col md={2} className="d-none d-md-block p-0">
          <PlayerSidebar playerName={playerName} />
        </Col>
        <Col xs={12} md={10} className="p-0">
          <div className="d-md-none bg-dark text-light p-3 d-flex justify-content-between align-items-center">
            <h4>{playerName}</h4>
            <Button variant="outline-light" onClick={handleShowSidebar}>
              <FontAwesomeIcon icon={faBars} />
            </Button>
          </div>
          <Offcanvas show={showSidebar} onHide={handleCloseSidebar}>
            <Offcanvas.Header closeButton className="bg-dark text-light">
              <Offcanvas.Title>Menú del Jugador</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="p-0">
              <PlayerSidebar onHide={handleCloseSidebar} playerName={playerName} />
            </Offcanvas.Body>
          </Offcanvas>
          <div className="p-4">
            <h1 className="mb-4">Mi Perfil</h1>
            <Card>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <div className="d-flex flex-column align-items-center mb-4">
                    <Image
                      src={photoPreview || (playerData.FOTO_PERFIL ? `${API_URL}storage/${playerData.FOTO_PERFIL}` : 'https://via.placeholder.com/150')}
                      roundedCircle
                      style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                      className="mb-3"
                    />
                    {isEditing && (
                      <Form.Group controlId="formProfilePhoto" className="w-100 text-center">
                        <Form.Label>Cambiar Foto</Form.Label>
                        <Form.Control type="file" onChange={handleFileChange} />
                      </Form.Group>
                    )}
                  </div>
                  
                  {/* Fila 1: Nombre (completa) */}
                  <Row className="mb-3">
                    <Col>
                      <Form.Group controlId="formPlayerName">
                        <Form.Label>Nombre Completo</Form.Label>
                        <Form.Control
                          type="text"
                          name="NOMBRE"
                          value={editedData.NOMBRE || ''}
                          onChange={handleEditChange}
                          disabled={!isEditing}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Fila 2: Celular y Email (separados en dos columnas) */}
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group controlId="formPlayerPhone">
                        <Form.Label>Celular</Form.Label>
                        <Form.Control
                          type="tel"
                          name="CELULAR"
                          value={editedData.CELULAR || ''}
                          onChange={handleEditChange}
                          disabled={!isEditing}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="formPlayerEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" value={playerData.user?.EMAIL || ''} readOnly />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Fila 3: Estado y Ciudad (separados en dos columnas) */}
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group controlId="formPlayerState">
                        <Form.Label>Estado</Form.Label>
                        <Form.Control type="text" value={playerData.estado?.NOMBRE || ''} readOnly />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="formPlayerCity">
                        <Form.Label>Ciudad</Form.Label>
                        <Form.Control type="text" value={playerData.ciudad?.NOMBRE || ''} readOnly />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Fila 4: Categoría y Posición (separados en dos columnas) */}
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group controlId="formPlayerCategory">
                        <Form.Label>Categoría</Form.Label>
                        <Form.Control type="text" value={playerData.categoria?.NOMBRE || ''} readOnly />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="formPlayerPosition">
                        <Form.Label>Posición en Cancha</Form.Label>
                        <Form.Control
                          as="select"
                          name="POSICION_CANCHA"
                          value={editedData.POSICION_CANCHA || ''}
                          onChange={handleEditChange}
                          disabled={!isEditing}
                          required
                        >
                          <option value="">Seleccione una posición</option>
                          {positions.map((position) => (
                            <option key={position} value={position}>{position}</option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Fila 5: Club (completa) */}
                  <Row className="mb-3">
                    <Col>
                      <Form.Group controlId="formPlayerClub">
                        <Form.Label>Club</Form.Label>
                        <Form.Control type="text" value={playerData.club?.NOMBRE || ''} readOnly />
                      </Form.Group>
                    </Col>
                  </Row>

                  <hr />
                  
                  {/* Botones de acción */}
                  {!isEditing ? (
                    <Button variant="primary" onClick={() => setIsEditing(true)}>
                      Editar Perfil
                    </Button>
                  ) : (
                    <div className="d-flex justify-content-between">
                      <Button variant="success" type="submit" disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : 'Guardar Cambios'}
                      </Button>
                      <Button variant="secondary" onClick={() => setIsEditing(false)}>
                        Cancelar
                      </Button>
                    </div>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default PlayerProfile;