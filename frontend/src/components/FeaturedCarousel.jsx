import React from 'react';
import { Carousel } from 'react-bootstrap';

const featuredItems = [
  {
    image: 'https://via.placeholder.com/800x300?text=Featured+Item+1',
    title: 'Stylish Jacket',
    desc: 'Perfect for cool evenings. Size M.'
  },
  {
    image: 'https://via.placeholder.com/800x300?text=Featured+Item+2',
    title: 'Summer Dress',
    desc: 'Light and breezy. Size S.'
  },
  {
    image: 'https://via.placeholder.com/800x300?text=Featured+Item+3',
    title: 'Classic Jeans',
    desc: 'Timeless style. Size L.'
  }
];

const FeaturedCarousel = () => (
  <Carousel className="mb-4">
    {featuredItems.map((item, idx) => (
      <Carousel.Item key={idx}>
        <img
          className="d-block w-100"
          src={item.image}
          alt={item.title}
        />
        <Carousel.Caption>
          <h5>{item.title}</h5>
          <p>{item.desc}</p>
        </Carousel.Caption>
      </Carousel.Item>
    ))}
  </Carousel>
);

export default FeaturedCarousel; 