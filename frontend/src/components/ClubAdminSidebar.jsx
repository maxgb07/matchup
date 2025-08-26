import React from 'react';
import { Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUsers, faTrophy, faPlus, faEye, faUserCircle, faSignOutAlt, faFutbol } from '@fortawesome/free-solid-svg-icons';

// Acepta la prop clubName
const ClubAdminSidebar = ({ onHide, clubName }) => {
  const navigate = useNavigate();
  // Eliminamos el valor fijo 'Admin del Club' de aquí
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('club_name'); // Agregamos la eliminación del nombre del club
    navigate('/club-admin/login');
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
        <Nav.Link className="text-light" onClick={() => handleNavClick('/club-admin/dashboard')}>
          <FontAwesomeIcon icon={faHome} className="me-2" />
          Dashboard
        </Nav.Link>
        <hr className="bg-secondary" />

        <div className="nav-item-accordion">
          <a className="nav-link text-light d-flex justify-content-between align-items-center" data-bs-toggle="collapse" href="#playersMenu">
            <span>
              <FontAwesomeIcon icon={faUsers} className="me-2" />
              Jugadores
            </span>
            <FontAwesomeIcon icon={faPlus} />
          </a>
          <div className="collapse" id="playersMenu">
            <ul className="nav flex-column ms-3">
              <li className="nav-item">
                <Nav.Link className="text-light" onClick={() => handleNavClick('/club-admin/players/create')}>
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                  Nuevo
                </Nav.Link>
              </li>
              <li className="nav-item">
                <Nav.Link className="text-light" onClick={() => handleNavClick('/club-admin/players')}>
                  <FontAwesomeIcon icon={faEye} className="me-2" />
                  Ver
                </Nav.Link>
              </li>
            </ul>
          </div>
        </div>
        <hr className="bg-secondary" />

        <Nav.Link className="text-light" onClick={() => handleNavClick('/ranking')}>
          <FontAwesomeIcon icon={faTrophy} className="me-2" />
          Ranking
        </Nav.Link>
        <hr className="bg-secondary" />
      </Nav>

      <div className="mt-auto pt-3">
        <div className="text-center mb-2">
          <FontAwesomeIcon icon={faUserCircle} size="2x" />
          {/* Muestra el nombre del club que se pasa por prop */}
          <p className="mt-2">{clubName || "Cargando..."}</p>
        </div>
        <Button variant="danger" className="w-100" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
};

export default ClubAdminSidebar;