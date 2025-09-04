import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Spinner, Offcanvas, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import SuperAdminSidebar from '../components/SuperAdminSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faEye } from '@fortawesome/free-solid-svg-icons';
const API_URL = import.meta.env.VITE_API_URL;

const ViewClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  const handleShowSidebar = () => setShowSidebar(true);
  const handleCloseSidebar = () => setShowSidebar(false);

  useEffect(() => {
    const fetchClubs = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/super-admin/login');
        return;
      }

      try {
        const response = await fetch(`${API_URL}super-admin/clubs`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Error al obtener los clubes');
        }

        setClubs(data.clubs);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, [navigate]);

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col md={2} className="d-none d-md-block p-0">
          <SuperAdminSidebar />
        </Col>

        <Col xs={12} md={10} className="p-0">
          <div className="d-md-none bg-dark text-light p-3 d-flex justify-content-between align-items-center">
            <h4>matchcup</h4>
            <Button variant="outline-light" onClick={handleShowSidebar}>
              <FontAwesomeIcon icon={faBars} />
            </Button>
          </div>

          <Offcanvas show={showSidebar} onHide={handleCloseSidebar}>
            <Offcanvas.Header closeButton className="bg-dark text-light">
              <Offcanvas.Title>Menú</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="p-0">
              <SuperAdminSidebar onHide={handleCloseSidebar} />
            </Offcanvas.Body>
          </Offcanvas>

          <div className="p-4">
            <h1 className="mb-4">Clubes Registrados</h1>
            <Card>
              <Card.Body>
                {loading ? (
                  <div className="d-flex justify-content-center py-5">
                    <Spinner animation="border" />
                  </div>
                ) : clubs.length > 0 ? (
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Subdominio</th>
                        <th>Admin Email</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clubs.map((club, index) => (
                        <tr key={club.ID}>
                          <td>{index + 1}</td>
                          <td>{club.NOMBRE}</td>
                          <td>{club.SUBDOMINIO}</td>
                          <td>{club.admin.EMAIL}</td>
                          <td>
                            {/* Aquí irían los botones de acción como "Ver detalles" o "Eliminar" */}
                            <Button variant="info" size="sm">
                              <FontAwesomeIcon icon={faEye} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p className="text-center">No hay clubes registrados.</p>
                )}
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewClubs;