import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const ItemCard = ({ image, name, description, buttonLabel = 'View Item', onButtonClick, isFavorite, onFavoriteToggle }) => (
  <Card className="h-100 position-relative">
    <Card.Img variant="top" src={image || 'https://via.placeholder.com/300x200?text=Item+Image'} alt={name} />
    <Card.Body>
      <Card.Title>{name || 'Item Name'}</Card.Title>
      <Card.Text>{description || 'Short item description goes here.'}</Card.Text>
      <Button variant="primary" onClick={onButtonClick}>{buttonLabel}</Button>
    </Card.Body>
    {onFavoriteToggle && (
      <Button
        variant="link"
        className="position-absolute top-0 end-0 m-2 p-0"
        style={{ fontSize: '1.5rem', color: isFavorite ? 'red' : 'gray' }}
        onClick={e => { e.stopPropagation(); onFavoriteToggle(); }}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFavorite ? <FaHeart /> : <FaRegHeart />}
      </Button>
    )}
  </Card>
);

export default ItemCard; 