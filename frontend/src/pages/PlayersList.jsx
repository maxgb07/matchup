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
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();
  
  // Estados para los filtros
  const [filterName, setFilterName] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [categories, setCategories] = useState([]);

  // Estados para la modal
  const [showModal, setShowModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const clubName = localStorage.getItem('club_name') || 'Admin del Club';
  const API_URL = import.meta.env.VITE_API_URL;
  const PROFILE_PHOTO_URL = `${API_URL}profiles/`;

  const handleShowSidebar = () => setShowSidebar(true);
  const handleCloseSidebar = () => setShowSidebar(false);
  
  const handleShowModal = (player) => {
    setSelectedPlayer(player);
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    const fetchPlayers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/club-admin/login');
        return;
      }
      
      try {
        const response = await fetch(`${API_URL}club-admin/players`, {
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
        setPlayers(data);
        setFilteredPlayers(data); // Inicialmente, los jugadores filtrados son todos los jugadores
        
        // Obtener categorías únicas para el filtro
        const uniqueCategories = [...new Set(data.map(p => {
          if (p.categoria?.NOMBRE && p.categoria?.GENERO) {
            return `${p.categoria.NOMBRE} - ${p.categoria.GENERO}`;
          }
          return null;
        }))].filter(Boolean);
        setCategories(uniqueCategories);

      } catch (error) {
        console.error('Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [API_URL, navigate]);

  // useEffect para aplicar los filtros cuando cambian
  useEffect(() => {
    const applyFilters = () => {
      let tempPlayers = [...players];

      // Filtro por nombre
      if (filterName) {
        tempPlayers = tempPlayers.filter(p => p.NOMBRE.toLowerCase().includes(filterName.toLowerCase()));
      }

      // Filtro por categoría
      if (filterCategory) {
        tempPlayers = tempPlayers.filter(p => {
          if (p.categoria?.NOMBRE && p.categoria?.GENERO) {
            return `${p.categoria.NOMBRE} - ${p.categoria.GENERO}` === filterCategory;
          }
          return false;
        });
      }

      // Filtro por posición
      if (filterPosition) {
        tempPlayers = tempPlayers.filter(p => p.POSICION_CANCHA === filterPosition);
      }
      
      setFilteredPlayers(tempPlayers);
    };

    applyFilters();
  }, [filterName, filterCategory, filterPosition, players]);

  // Columnas para la tabla
  const columns = [
    { name: 'Nombre', selector: row => row.NOMBRE, sortable: true },
    { name: 'Email', selector: row => row.user.EMAIL, sortable: true },
    { name: 'Celular', selector: row => row.CELULAR, sortable: true },
    { name: 'Club', selector: row => row.club?.NOMBRE, sortable: true },
    { name: 'Categoría', selector: row => `${row.categoria?.NOMBRE} - ${row.categoria?.GENERO}`, sortable: true },
    { name: 'Posición', selector: row => row.POSICION_CANCHA, sortable: true },
    { 
      name: 'Acciones',
      cell: row => (
        <Button variant="primary" size="sm" onClick={() => handleShowModal(row)}>
          <FontAwesomeIcon icon={faEye} />
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
  ];

  const subHeaderComponentMemo = React.useMemo(() => {
    return (
      <Row className="w-100 mb-3">
        <Col md={4} className="mb-2">
          <Form.Control
            type="text"
            placeholder="Filtrar por nombre"
            value={filterName}
            onChange={e => setFilterName(e.target.value)}
          />
        </Col>
        <Col md={4} className="mb-2">
          <Form.Control 
            as="select"
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
          >
            <option value="">Filtrar por categoría</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Form.Control>
        </Col>
        <Col md={4} className="mb-2">
          <Form.Control 
            as="select"
            value={filterPosition}
            onChange={e => setFilterPosition(e.target.value)}
          >
            <option value="">Filtrar por posición</option>
            <option value="Derecha">Derecha</option>
            <option value="Reves">Reves</option>
            <option value="Ambas">Ambas</option>
          </Form.Control>
        </Col>
      </Row>
    );
  }, [filterName, filterCategory, filterPosition, categories]);
  

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
            <h1 className="mb-4">Lista de Jugadores Registrados</h1>
            <Card>
              <Card.Body>
                {loading ? (
                  <div className="text-center">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </Spinner>
                  </div>
                ) : players.length === 0 ? (
                  <div className="text-center">
                    <p>No hay jugadores registrados aún.</p>
                  </div>
                ) : (
                  <DataTable
                    columns={columns}
                    data={filteredPlayers}
                    pagination
                    subHeader
                    subHeaderComponent={subHeaderComponentMemo}
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
              <Image src={`${PROFILE_PHOTO_URL}${selectedPlayer.FOTO_PERFIL}`} roundedCircle style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
            </div>
          )}
          <p><strong>Email:</strong> {selectedPlayer?.user?.EMAIL}</p>
          <p><strong>Celular:</strong> {selectedPlayer?.CELULAR}</p>
          <p><strong>Estado:</strong> {selectedPlayer?.estado?.NOMBRE}</p>
          <p><strong>Ciudad:</strong> {selectedPlayer?.ciudad?.NOMBRE}</p>
          <p><strong>Categoría:</strong> {selectedPlayer?.categoria?.NOMBRE} - {selectedPlayer?.categoria?.GENERO}</p>
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