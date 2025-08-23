import React from 'react';
import { Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUsers, faTrophy, faPlus, faEye, faUserCircle, faSignOutAlt, faFutbol } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const PlayerSidebar = ({ playerName, onHide }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Tu sesión se cerrará!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('token_type');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_id');
        localStorage.removeItem('token');
        navigate('/player/login');
        onHide(); // Cierra el Offcanvas si está abierto
      }
    });
  };

  const handleNavClick = (path) => {
    navigate(path);
    if (onHide) onHide();
  };

return (
    <div className="bg-dark text-light p-4 d-flex flex-column" style={{ minHeight: '100vh' }}>
      <div className="text-center mb-4">
        <FontAwesomeIcon icon={faFutbol} size="3x" />
        <h4 className="mt-2">Matchup</h4>
      </div>
      <hr className="bg-light" />
      <Nav className="flex-column">
        <Nav.Link className="text-light" onClick={() => handleNavClick('/player/dashboard')}>
          <FontAwesomeIcon icon={faHome} className="me-2" />
          Dashboard
        </Nav.Link>
        <hr className="bg-secondary" />

        <Nav.Link className="text-light" onClick={() => handleNavClick('/player/profile')}>
          <FontAwesomeIcon icon={faUsers} className="me-2" />
          Mi Perfil
        </Nav.Link>
        <hr className="bg-secondary" />

        <Nav.Link className="text-light" onClick={() => handleNavClick('/player/ranking')}>
          <FontAwesomeIcon icon={faTrophy} className="me-2" />
          Ranking
        </Nav.Link>
        <hr className="bg-secondary" />
      </Nav>

      <div className="mt-auto pt-3">
        <div className="text-center mb-2">
          <FontAwesomeIcon icon={faUserCircle} size="2x" />
          {/* Muestra el nombre del club que se pasa por prop */}
          <p className="mt-2">{playerName || "Cargando..."}</p>
        </div>
        <Button variant="danger" className="w-100" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
};

export default PlayerSidebar;