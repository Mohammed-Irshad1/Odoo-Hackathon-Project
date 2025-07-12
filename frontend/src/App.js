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

function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  const isLoggedIn = !!localStorage.getItem('token');
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">ReWear</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/browse">Browse</Link></li>
            {!isLoggedIn && <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>}
            {!isLoggedIn && <li className="nav-item"><Link className="nav-link" to="/register">Sign Up</Link></li>}
            {isLoggedIn && <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>}
            {isLoggedIn && <li className="nav-item"><Link className="nav-link" to="/add-item">List an Item</Link></li>}
            {isLoggedIn && <li className="nav-item"><Link className="nav-link" to="/admin">Admin</Link></li>}
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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
