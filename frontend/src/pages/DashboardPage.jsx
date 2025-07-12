import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import api from '../api/axios';
import ItemCard from '../components/ItemCard';

const mockItems = [
  {
    id: 1,
    image: 'https://via.placeholder.com/300x200?text=Jacket',
    name: 'Stylish Jacket',
    description: 'Perfect for cool evenings. Size M.'
  },
  {
    id: 2,
    image: 'https://via.placeholder.com/300x200?text=Dress',
    name: 'Summer Dress',
    description: 'Light and breezy. Size S.'
  },
  {
    id: 3,
    image: 'https://via.placeholder.com/300x200?text=Jeans',
    name: 'Classic Jeans',
    description: 'Timeless style. Size L.'
  },
  {
    id: 4,
    image: 'https://via.placeholder.com/300x200?text=Shirt',
    name: 'Formal Shirt',
    description: 'Great for office or events. Size M.'
  }
];

const DashboardPage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemsError, setItemsError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      setItemsLoading(true);
      setItemsError('');
      try {
        const res = await api.get('/items');
        setItems(res.data);
      } catch (err) {
        setItemsError('Failed to load items. Showing mock data.');
        setItems(mockItems);
      } finally {
        setItemsLoading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="mb-4">User Dashboard</h2>
      {loading && <div className="text-center"><Spinner animation="border" /></div>}
      {error && <Alert variant="danger">{error}</Alert>}
      {profile && (
        <Row className="mb-4">
          <Col md={4}>
            <Card><Card.Body><Card.Title>Profile</Card.Title>
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
            </Card.Body></Card>
          </Col>
          <Col md={4}>
            <Card><Card.Body><Card.Title>Points</Card.Title>
              <p>{profile.points}</p>
            </Card.Body></Card>
          </Col>
          <Col md={4}>
            <Card><Card.Body><Card.Title>My Listings</Card.Title><p>[Uploaded Items]</p></Card.Body></Card>
          </Col>
        </Row>
      )}
      <h3 className="mb-3">Product Listings</h3>
      {itemsLoading && <div className="text-center"><Spinner animation="border" /></div>}
      {itemsError && <Alert variant="warning">{itemsError}</Alert>}
      <Row xs={1} sm={2} md={4} className="g-4 mb-4">
        {items.map(item => (
          <Col key={item.id}>
            <ItemCard image={item.image} name={item.name || item.title} description={item.description} />
          </Col>
        ))}
      </Row>
      <Card><Card.Body><Card.Title>Ongoing & Completed Swaps</Card.Title><p>[Swaps List]</p></Card.Body></Card>
    </div>
  );
};

export default DashboardPage; 