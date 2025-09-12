import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // Si no hay token, redirige al login
    return <Navigate to="/" replace />;
  }

  // Si hay token, renderiza las rutas hijas
  return <Outlet />;
};

export default ProtectedRoute;