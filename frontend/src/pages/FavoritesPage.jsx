import React, { useEffect, useState } from 'react';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import api from '../api/axios';
import ItemCard from '../components/ItemCard';

const FavoritesPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFavorites = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/users/favorites', { headers: { Authorization: `Bearer ${token}` } });
      setItems(res.data);
    } catch (err) {
      setError('Failed to load favorites.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleUnfavorite = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/users/favorites/${itemId}`, { headers: { Authorization: `Bearer ${token}` } });
      setItems(items => items.filter(item => item.id !== itemId));
    } catch (err) {
      alert('Failed to remove favorite.');
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">My Favorites</h2>
      {loading && <div className="text-center"><Spinner animation="border" /></div>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Row xs={1} sm={2} md={4} className="g-4">
        {items.map(item => (
          <Col key={item.id}>
            <ItemCard
              image={item.image ? `http://localhost:5000/uploads/${item.image}` : undefined}
              name={item.title || item.name}
              description={item.description}
              isFavorite={true}
              onFavoriteToggle={() => handleUnfavorite(item.id)}
            />
          </Col>
        ))}
        {!loading && items.length === 0 && <div className="text-center">No favorites yet.</div>}
      </Row>
    </div>
  );
};

export default FavoritesPage; 