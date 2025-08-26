import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SuperAdminLogin from './pages/SuperAdminLogin';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import CreateClub from './pages/CreateClub';
import ViewClubs from './pages/ViewClubs';
import ClubAdminLogin from './pages/ClubAdminLogin';
import ClubAdminDashboard from './pages/ClubAdminDashboard';
import CreatePlayer from './pages/CreatePlayer';
import PlayersList from './pages/PlayersList';
import PlayerRegister from './pages/PlayerRegister';
import PlayerLogin from './pages/PlayerLogin';
import PlayerDashboard from './pages/PlayerDashboard';
import PlayerProfile from './pages/PlayerProfile';
import Ranking from './pages/Ranking';
import ProtectedRoute from './pages/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<HomePage />} />
        
        <Route path="/super-admin/login" element={<SuperAdminLogin />} />
        <Route path="/club-admin/login" element={<ClubAdminLogin />} />
        <Route path="/player/register" element={<PlayerRegister />} />
        <Route path="/player/login" element={<PlayerLogin />} />
        

        {/* Agrupamos las rutas protegidas dentro de ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/super-admin/clubs/create" element={<CreateClub />} />
          <Route path="/super-admin/clubs" element={<ViewClubs />} />
          <Route path="/club-admin/dashboard" element={<ClubAdminDashboard/>} />
          <Route path="/club-admin/players/create" element={<CreatePlayer />} />
          <Route path="/club-admin/players" element={<PlayersList />} />
          <Route path="/player/dashboard" element={<PlayerDashboard />} />
          <Route path="/player/profile" element={<PlayerProfile />} />
          <Route path="/ranking" element={<Ranking />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;