import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import api from '../api/axios';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await api.post('/auth/login', form);
      setSuccess('Login successful!');
      localStorage.setItem('token', res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '22rem' }}>
        <Card.Body>
          <Card.Title className="mb-4 text-center">Login to ReWear</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter email" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">Login</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LoginPage; 