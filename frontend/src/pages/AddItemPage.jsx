import React, { useState } from 'react';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import api from '../api/axios';

const AddItemPage = () => {
  const [form, setForm] = useState({
    title: '', description: '', category: '', type: '', size: '', condition: '', tags: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleImageChange = e => setImage(e.target.files[0]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      if (image) data.append('image', image);
      await api.post('/items', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccess('Item added successfully!');
      setForm({ title: '', description: '', category: '', type: '', size: '', condition: '', tags: '' });
      setImage(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '32rem' }}>
        <Card.Body>
          <Card.Title className="mb-4 text-center">List a New Item</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Form.Group className="mb-3" controlId="formImages">
              <Form.Label>Upload Images</Form.Label>
              <Form.Control type="file" name="image" onChange={handleImageChange} accept="image/*" required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" name="title" value={form.title} onChange={handleChange} placeholder="Enter item title" required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} name="description" value={form.description} onChange={handleChange} placeholder="Enter item description" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control type="text" name="category" value={form.category} onChange={handleChange} placeholder="e.g. Shirts, Pants" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formType">
              <Form.Label>Type</Form.Label>
              <Form.Control type="text" name="type" value={form.type} onChange={handleChange} placeholder="e.g. Men, Women, Kids" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formSize">
              <Form.Label>Size</Form.Label>
              <Form.Control type="text" name="size" value={form.size} onChange={handleChange} placeholder="e.g. M, L, XL" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formCondition">
              <Form.Label>Condition</Form.Label>
              <Form.Control type="text" name="condition" value={form.condition} onChange={handleChange} placeholder="e.g. New, Gently Used" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formTags">
              <Form.Label>Tags</Form.Label>
              <Form.Control type="text" name="tags" value={form.tags} onChange={handleChange} placeholder="e.g. Summer, Formal" />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Submit'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddItemPage; 