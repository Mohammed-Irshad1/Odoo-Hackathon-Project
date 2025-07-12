import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import api from '../api/axios';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const res = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password
      });
      setSuccess('Registration successful!');
      localStorage.setItem('token', res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '24rem' }}>
        <Card.Body>
          <Card.Title className="mb-4 text-center">Register for ReWear</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={form.name} onChange={handleChange} placeholder="Enter your name" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter email" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm Password" />
            </Form.Group>
            <Button variant="success" type="submit" className="w-100">Register</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default RegisterPage; 