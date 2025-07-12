import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import FeaturedCarousel from '../components/FeaturedCarousel';
import ItemCard from '../components/ItemCard';

const demoItems = [
  {
    image: 'https://via.placeholder.com/300x200?text=Jacket',
    name: 'Stylish Jacket',
    description: 'Perfect for cool evenings. Size M.'
  },
  {
    image: 'https://via.placeholder.com/300x200?text=Dress',
    name: 'Summer Dress',
    description: 'Light and breezy. Size S.'
  },
  {
    image: 'https://via.placeholder.com/300x200?text=Jeans',
    name: 'Classic Jeans',
    description: 'Timeless style. Size L.'
  },
  {
    image: 'https://via.placeholder.com/300x200?text=Shirt',
    name: 'Formal Shirt',
    description: 'Great for office or events. Size M.'
  }
];

const LandingPage = () => (
  <div className="container py-5">
    <div className="text-center mb-5">
      <h1 className="display-4 fw-bold">Welcome to ReWear</h1>
      <p className="lead">Exchange unused clothing, earn points, and promote sustainable fashion.</p>
      <div className="d-flex justify-content-center gap-3 mt-4">
        <Button variant="primary" size="lg">Start Swapping</Button>
        <Button variant="outline-secondary" size="lg">Browse Items</Button>
        <Button variant="success" size="lg">List an Item</Button>
      </div>
    </div>
    <div className="mb-5">
      <h3>Featured Items</h3>
      <FeaturedCarousel />
    </div>
    <div className="mb-5">
      <h3>Product Listings</h3>
      <Row xs={1} sm={2} md={4} className="g-4">
        {demoItems.map((item, idx) => (
          <Col key={idx}>
            <ItemCard {...item} />
          </Col>
        ))}
      </Row>
    </div>
  </div>
);

export default LandingPage; 