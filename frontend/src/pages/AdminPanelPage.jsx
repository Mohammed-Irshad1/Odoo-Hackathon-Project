import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Table, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import api from '../api/axios';

const AdminPanelPage = () => {
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalItem, setModalItem] = useState(null);
  const [modalReason, setModalReason] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const [usersRes, itemsRes] = await Promise.all([
          api.get('/users/all', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/items/admin/all', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setUsers(usersRes.data);
        setItems(itemsRes.data);
      } catch (err) {
        setError('Failed to load admin data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApprove = (item) => {
    setModalType('approve');
    setModalItem(item);
    setModalReason('');
    setShowModal(true);
  };

  const handleReject = (item) => {
    setModalType('reject');
    setModalItem(item);
    setModalReason('');
    setShowModal(true);
  };

  const handleDelete = (item) => {
    setModalType('delete');
    setModalItem(item);
    setModalReason('');
    setShowModal(true);
  };

  const handleModalSubmit = async () => {
    const token = localStorage.getItem('token');
    if (modalType === 'approve') {
      await api.put(`/items/${modalItem.id}`, { status: 'approved', reason: modalReason }, { headers: { Authorization: `Bearer ${token}` } });
      setItems(items => items.map(item => item.id === modalItem.id ? { ...item, status: 'approved' } : item));
    } else if (modalType === 'reject') {
      await api.put(`/items/${modalItem.id}`, { status: 'rejected', reason: modalReason }, { headers: { Authorization: `Bearer ${token}` } });
      setItems(items => items.map(item => item.id === modalItem.id ? { ...item, status: 'rejected' } : item));
    } else if (modalType === 'delete') {
      await api.delete(`/items/${modalItem.id}`, { headers: { Authorization: `Bearer ${token}` }, data: { reason: modalReason } });
      setItems(items => items.filter(item => item.id !== modalItem.id));
    }
    setShowModal(false);
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Admin Panel</h2>
      {loading && <div className="text-center"><Spinner animation="border" /></div>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Row className="mb-4">
        <Col md={4}><Button variant="outline-primary" className="w-100 mb-2">Manage Users</Button></Col>
        <Col md={4}><Button variant="outline-success" className="w-100 mb-2">Manage Orders</Button></Col>
        <Col md={4}><Button variant="outline-warning" className="w-100 mb-2">Manage Listings</Button></Col>
      </Row>
      <Card className="mb-4"><Card.Body>
        <Card.Title>Manage Users</Card.Title>
        <Table striped bordered hover responsive size="sm">
          <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Points</th><th>Joined</th></tr></thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}><td>{user.id}</td><td>{user.name}</td><td>{user.email}</td><td>{user.points}</td><td>{user.created_at}</td></tr>
            ))}
          </tbody>
        </Table>
      </Card.Body></Card>
      <Card><Card.Body>
        <Card.Title>Manage Listings</Card.Title>
        <Table striped bordered hover responsive size="sm">
          <thead><tr><th>ID</th><th>Title</th><th>User ID</th><th>Status</th><th>Reason</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.title || item.name}</td>
                <td>{item.user_id}</td>
                <td>{item.status}</td>
                <td>{item.reason || ''}</td>
                <td>
                  {item.status !== 'approved' && item.status !== 'rejected' && <>
                    <Button size="sm" variant="success" className="me-2" onClick={() => handleApprove(item)}>Approve</Button>
                    <Button size="sm" variant="warning" className="me-2" onClick={() => handleReject(item)}>Reject</Button>
                  </>}
                  <Button size="sm" variant="danger" onClick={() => handleDelete(item)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body></Card>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalType === 'approve' ? 'Approve Item' : modalType === 'reject' ? 'Reject Item' : 'Delete Item'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Reason/Feedback (optional)</Form.Label>
            <Form.Control as="textarea" rows={3} value={modalReason} onChange={e => setModalReason(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleModalSubmit}>Submit</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminPanelPage; 