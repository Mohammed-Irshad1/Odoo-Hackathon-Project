import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';

const AdminPanelPage = () => (
  <div className="container py-5">
    <h2 className="mb-4">Admin Panel</h2>
    <Row className="mb-4">
      <Col md={4}><Button variant="outline-primary" className="w-100 mb-2">Manage Users</Button></Col>
      <Col md={4}><Button variant="outline-success" className="w-100 mb-2">Manage Orders</Button></Col>
      <Col md={4}><Button variant="outline-warning" className="w-100 mb-2">Manage Listings</Button></Col>
    </Row>
    <Card><Card.Body>
      <Card.Title>Manage Users</Card.Title>
      <div>[User List with Actions Placeholder]</div>
    </Card.Body></Card>
  </div>
);

export default AdminPanelPage; 