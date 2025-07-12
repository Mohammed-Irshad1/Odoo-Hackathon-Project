import React, { useEffect, useState } from 'react';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ItemCard from '../components/ItemCard';

const BrowsePage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/items');
        setItems(res.data);
      } catch (err) {
        setError('Failed to load items.');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleItemClick = (id) => {
    navigate(`/item/${id}`);
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Browse Items</h2>
      {loading && <div className="text-center"><Spinner animation="border" /></div>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Row xs={1} sm={2} md={4} className="g-4">
        {items.map(item => (
          <Col key={item.id} onClick={() => handleItemClick(item.id)} style={{ cursor: 'pointer' }}>
            <ItemCard image={item.image ? `http://localhost:5000/uploads/${item.image}` : undefined} name={item.title || item.name} description={item.description} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default BrowsePage; 