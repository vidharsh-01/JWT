// src/pages/Products.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useActivityTracker from '../hooks/useActivityTracker';  // Correct: no braces for default import

import Carousel from 'react-bootstrap/Carousel';
import slide1 from '../images/first_slide.png';
export default function Products() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const sessionId = localStorage.getItem('sessionId');
  const { trackEvent } = useActivityTracker(userId, sessionId);

  useEffect(() => {
    trackEvent('page_view', '/products');
  }, [trackEvent]);

  const products = [
    { id: 1, name: 'iPhone 15', price: 999, image: 'iphone.jpg' },
    { id: 2, name: 'Samsung S24', price: 899, image: 'samsung.jpg' },
    { id: 3, name: 'MacBook Pro', price: 1999, image: 'macbook.jpg' }
  ];

  const addToCart = (productId) => {
    trackEvent('add_to_cart', '/products', { productId });
    alert(`${products.find(p => p.id === productId).name} added to cart!`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Products</h1>
      <Carousel>
      <Carousel.Item>
        <img className="d-block w-100" src={slide1} alt="First slide" />
      </Carousel.Item>
      <Carousel.Item>
        <img className="d-block w-100" src={slide1} alt="First slide" />
      </Carousel.Item>
      <Carousel.Item>
        <img className="d-block w-100" src={slide1} alt="First slide" />
      </Carousel.Item>
    </Carousel>
      <div style={{ display: 'flex', gap: '20px' }}>
        {products.map(product => (
          <div key={product.id} style={{ border: '1px solid #ccc', padding: '10px', width: '200px' }}>
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <button onClick={() => addToCart(product.id)}>
              Add to Cart
            </button>
            <button onClick={() => navigate(`/product/${product.id}`)}>
              View Details
            </button>
          </div>
        ))}
      </div>
      <button onClick={() => navigate('/cart')}>Go to Cart</button>
    </div>
  );
}
