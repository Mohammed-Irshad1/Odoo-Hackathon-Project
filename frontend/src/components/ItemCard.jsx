import React from 'react';
import { Card, Button } from 'react-bootstrap';

const ItemCard = ({ image, name, description, buttonLabel = 'View Item', onButtonClick }) => (
  <Card className="h-100">
    <Card.Img variant="top" src={image || 'https://via.placeholder.com/300x200?text=Item+Image'} alt={name} />
    <Card.Body>
      <Card.Title>{name || 'Item Name'}</Card.Title>
      <Card.Text>{description || 'Short item description goes here.'}</Card.Text>
      <Button variant="primary" onClick={onButtonClick}>{buttonLabel}</Button>
    </Card.Body>
  </Card>
);

export default ItemCard; 