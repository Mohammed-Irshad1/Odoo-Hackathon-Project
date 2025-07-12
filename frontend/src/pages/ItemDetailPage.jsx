import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import api from '../api/axios';

const ItemDetailPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/items/${id}`);
        setItem(res.data);
      } catch (err) {
        setError('Failed to load item.');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await api.put(`/items/${id}`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
      setItem(item => ({ ...item, status: newStatus }));
      setActionMsg(newStatus === 'swap requested' ? 'Swap requested!' : 'Redeemed via points!');
    } catch (err) {
      setActionMsg('Failed to update status.');
    }
  };

  const handleSwapRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.post('/items/swap-requests', { itemId: item.id, ownerId: item.user_id }, { headers: { Authorization: `Bearer ${token}` } });
      setActionMsg('Swap request sent!');
    } catch (err) {
      setActionMsg('Failed to send swap request.');
    }
  };

  return (
    <div className="container py-5">
      {loading && <div className="text-center"><Spinner animation="border" /></div>}
      {error && <Alert variant="danger">{error}</Alert>}
      {item && (
        <Row>
          <Col md={6} className="mb-4">
            <Card>
              <Card.Body>
                <div className="bg-light text-center" style={{height:'300px', display:'flex', alignItems:'center', justifyContent:'center'}}>
                  {item.image ? (
                    <img src={`http://localhost:5000/uploads/${item.image}`} alt={item.title || item.name} style={{maxHeight:'280px', maxWidth:'100%'}} />
                  ) : (
                    '[Image Gallery]'
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>{item.title || item.name}</Card.Title>
                <p>{item.description}</p>
                <p><strong>Category:</strong> {item.category}</p>
                <p><strong>Type:</strong> {item.type}</p>
                <p><strong>Size:</strong> {item.size}</p>
                <p><strong>Condition:</strong> {item.condition}</p>
                <p><strong>Tags:</strong> {item.tags}</p>
                <p><strong>Uploader:</strong> User #{item.user_id}</p>
                <div className="d-flex gap-2">
                  <Button variant="primary" disabled={item.status === 'swap requested' || item.status === 'redeemed'} onClick={handleSwapRequest}>Swap Request</Button>
                  <Button variant="success" disabled={item.status === 'redeemed'} onClick={() => handleStatusChange('redeemed')}>Redeem via Points</Button>
                  <Button
                    variant="info"
                    className="mt-2"
                    onClick={() => navigate(`/messages?userId=${item.user_id}&itemId=${item.id}&partnerName=User%20${item.user_id}&itemTitle=${encodeURIComponent(item.title || item.name)}`)}
                  >
                    Message Owner
                  </Button>
                </div>
                {actionMsg && <Alert className="mt-3" variant="info">{actionMsg}</Alert>}
                <div className="mt-3"><span className="badge bg-info">{item.status || 'Available'}</span></div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default ItemDetailPage; 