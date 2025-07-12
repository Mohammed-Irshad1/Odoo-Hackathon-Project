import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import api from '../api/axios';

const ItemDetailPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
                  <Button variant="primary">Swap Request</Button>
                  <Button variant="success">Redeem via Points</Button>
                </div>
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