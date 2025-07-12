import React, { useEffect, useState } from 'react';
import { Row, Col, Spinner, Alert, Form, InputGroup, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ItemCard from '../components/ItemCard';

const categoryOptions = ['Shirts', 'Pants', 'Dresses', 'Shoes', 'Jackets', 'Accessories'];
const typeOptions = ['Men', 'Women', 'Unisex', 'Kids'];
const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const conditionOptions = ['New', 'Like New', 'Good', 'Fair', 'Used'];

const BrowsePage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [size, setSize] = useState('');
  const [condition, setCondition] = useState('');
  const [favoriteIds, setFavoriteIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {};
        if (search) params.search = search;
        if (category) params.category = category;
        if (type) params.type = type;
        if (size) params.size = size;
        if (condition) params.condition = condition;
        const res = await api.get('/items', { params });
        setItems(res.data);
      } catch (err) {
        setError('Failed to load items.');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [search, category, type, size, condition]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await api.get('/users/favorites', { headers: { Authorization: `Bearer ${token}` } });
        setFavoriteIds(res.data.map(item => item.id));
      } catch {}
    };
    fetchFavorites();
  }, []);

  const handleItemClick = (id) => {
    navigate(`/item/${id}`);
  };

  const handleFavoriteToggle = async (itemId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to favorite items.');
      return;
    }
    if (favoriteIds.includes(itemId)) {
      await api.delete(`/users/favorites/${itemId}`, { headers: { Authorization: `Bearer ${token}` } });
      setFavoriteIds(ids => ids.filter(id => id !== itemId));
    } else {
      await api.post('/users/favorites', { itemId }, { headers: { Authorization: `Bearer ${token}` } });
      setFavoriteIds(ids => [...ids, itemId]);
    }
  };

  // Remove local filtering, use items directly

  return (
    <div className="container py-5">
      <h2 className="mb-4">Browse Items</h2>
      <Form className="mb-4">
        <InputGroup className="mb-2">
          <Form.Control
            type="text"
            placeholder="Search by title or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </InputGroup>
        <Row className="g-2">
          <Col md={3} sm={6} xs={12}>
            <Form.Select value={category} onChange={e => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              {categoryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </Form.Select>
          </Col>
          <Col md={3} sm={6} xs={12}>
            <Form.Select value={type} onChange={e => setType(e.target.value)}>
              <option value="">All Types</option>
              {typeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </Form.Select>
          </Col>
          <Col md={3} sm={6} xs={12}>
            <Form.Select value={size} onChange={e => setSize(e.target.value)}>
              <option value="">All Sizes</option>
              {sizeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </Form.Select>
          </Col>
          <Col md={3} sm={6} xs={12}>
            <Form.Select value={condition} onChange={e => setCondition(e.target.value)}>
              <option value="">All Conditions</option>
              {conditionOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </Form.Select>
          </Col>
        </Row>
      </Form>
      {loading && <div className="text-center"><Spinner animation="border" /></div>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Row xs={1} sm={2} md={4} className="g-4">
        {items.map(item => (
          <Col key={item.id} onClick={() => handleItemClick(item.id)} style={{ cursor: 'pointer' }}>
            <ItemCard
              image={item.image ? `http://localhost:5000/uploads/${item.image}` : undefined}
              name={item.title || item.name}
              description={item.description}
              isFavorite={favoriteIds.includes(item.id)}
              onFavoriteToggle={e => { e.stopPropagation(); handleFavoriteToggle(item.id); }}
            />
          </Col>
        ))}
        {!loading && items.length === 0 && <div className="text-center">No items found.</div>}
      </Row>
    </div>
  );
};

export default BrowsePage; 