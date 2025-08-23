import React from 'react';
import { Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUsers, faTrophy, faPlus, faEye, faUserCircle, faSignOutAlt, faFutbol, faGear } from '@fortawesome/free-solid-svg-icons';

const SuperAdminSidebar = ({ onHide }) => {
  const navigate = useNavigate();
  
  // Nombre de usuario de ejemplo, se puede obtener del token en el futuro
  const userName = 'Super Admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/super-admin/login');
  };

  const handleNavClick = (path) => {
    navigate(path);
    if (onHide) onHide(); // Cierra el Offcanvas en móvil
  };

  return (
    <div className="bg-dark text-light p-4" style={{ minHeight: '100vh' }}>
      <div className="text-center mb-4">
        <FontAwesomeIcon icon={faFutbol} size="3x" />
        <h4 className="mt-2">Matchup</h4>
      </div>
      <hr className="bg-light" />
      <Nav className="flex-column">
        <Nav.Link className="text-light" onClick={() => handleNavClick('/super-admin/dashboard')}>
          <FontAwesomeIcon icon={faHome} className="me-2" />
          Dashboard
        </Nav.Link>
        <hr className="bg-secondary" />

        {/* Submenú de Clubes */}
        <div className="nav-item-accordion">
          <a className="nav-link text-light d-flex justify-content-between align-items-center" data-bs-toggle="collapse" href="#clubsMenu">
            <span>
              <FontAwesomeIcon icon={faUsers} className="me-2" />
              Clubes
            </span>
            <FontAwesomeIcon icon={faPlus} />
          </a>
          <div className="collapse" id="clubsMenu">
            <ul className="nav flex-column ms-3">
              <li className="nav-item">
                <Nav.Link className="text-light" onClick={() => handleNavClick('/super-admin/clubs/create')}>
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                  Nuevo
                </Nav.Link>
              </li>
              <li className="nav-item">
                <Nav.Link className="text-light" onClick={() => handleNavClick('/super-admin/clubs')}>
                  <FontAwesomeIcon icon={faEye} className="me-2" />
                  Ver
                </Nav.Link>
              </li>
            </ul>
          </div>
        </div>
        <hr className="bg-secondary" />

        {/* Submenú de Jugadores */}
        <div className="nav-item-accordion">
          <a className="nav-link text-light d-flex justify-content-between align-items-center" data-bs-toggle="collapse" href="#playersMenu">
            <span>
              <FontAwesomeIcon icon={faFutbol} className="me-2" />
              Jugadores
            </span>
            <FontAwesomeIcon icon={faPlus} />
          </a>
          <div className="collapse" id="playersMenu">
            <ul className="nav flex-column ms-3">
              <li className="nav-item">
                <Nav.Link className="text-light">
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                  Nuevo
                </Nav.Link>
              </li>
              <li className="nav-item">
                <Nav.Link className="text-light">
                  <FontAwesomeIcon icon={faEye} className="me-2" />
                  Ver
                </Nav.Link>
              </li>
            </ul>
          </div>
        </div>
        <hr className="bg-secondary" />

        {/* Submenú de Ranking */}
        <Nav.Link className="text-light">
          <FontAwesomeIcon icon={faTrophy} className="me-2" />
          Ranking
        </Nav.Link>
        <hr className="bg-secondary" />
        
        {/* Submenú de Configuración del Sistema (propuesto) */}
        <Nav.Link className="text-light">
          <FontAwesomeIcon icon={faGear} className="me-2" />
          Configuración
        </Nav.Link>
        <hr className="bg-secondary" />

        <div className="mt-auto pt-3">
          <div className="text-center mb-2">
            <FontAwesomeIcon icon={faUserCircle} size="2x" />
            <p className="mt-2">{userName}</p>
          </div>
          <Button variant="danger" className="w-100" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
            Cerrar Sesión
          </Button>
        </div>
      </Nav>
    </div>
  );
};

export default SuperAdminSidebar;