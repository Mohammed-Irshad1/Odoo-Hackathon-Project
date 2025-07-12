import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ItemDetailPage from './pages/ItemDetailPage';
import AddItemPage from './pages/AddItemPage';
import AdminPanelPage from './pages/AdminPanelPage';
import PrivateRoute from './components/PrivateRoute';
import BrowsePage from './pages/BrowsePage';
import FavoritesPage from './pages/FavoritesPage';
import { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import api from './api/axios';

function Navbar() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchNotifications = async () => {
      const token = localStorage.getItem('token');
      const res = await api.get('/users/notifications', { headers: { Authorization: `Bearer ${token}` } });
      setNotifications(res.data);
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">ReWear</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/browse">Browse</Link></li>
            {!isLoggedIn && <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>}
            {!isLoggedIn && <li className="nav-item"><Link className="nav-link" to="/register">Sign Up</Link></li>}
            {isLoggedIn && <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>}
            {isLoggedIn && <li className="nav-item"><Link className="nav-link" to="/add-item">List an Item</Link></li>}
            {isLoggedIn && <li className="nav-item"><Link className="nav-link" to="/admin">Admin</Link></li>}
            {isLoggedIn && <li className="nav-item"><Link className="nav-link" to="/favorites">My Favorites</Link></li>}
            {isLoggedIn && (
              <li className="nav-item position-relative">
                <button className="btn btn-link nav-link p-0" style={{ position: 'relative' }} onClick={() => setShowDropdown(d => !d)}>
                  <FaBell size={20} />
                  {unreadCount > 0 && <span style={{ position: 'absolute', top: 2, right: 2, background: 'red', color: 'white', borderRadius: '50%', fontSize: 10, padding: '2px 6px' }}>{unreadCount}</span>}
                </button>
                {showDropdown && (
                  <div style={{ position: 'absolute', right: 0, top: '100%', background: 'white', minWidth: 250, zIndex: 1000, boxShadow: '0 2px 8px #888', borderRadius: 8 }}>
                    <div className="p-2 border-bottom fw-bold">Notifications</div>
                    {notifications.length === 0 ? (
                      <div className="p-2 text-muted">No notifications</div>
                    ) : notifications.slice(0, 8).map(n => (
                      <div key={n.id} className={`p-2 border-bottom ${n.is_read ? '' : 'fw-bold'}`}>{n.content}</div>
                    ))}
                    <div className="p-2 text-center"><button className="btn btn-link btn-sm" onClick={() => setShowDropdown(false)}>Close</button></div>
                  </div>
                )}
              </li>
            )}
            {isLoggedIn && <li className="nav-item"><button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button></li>}
          </ul>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/item/:id" element={<ItemDetailPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/add-item" element={<AddItemPage />} />
          <Route path="/admin" element={<AdminPanelPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
