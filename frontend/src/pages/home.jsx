import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/productCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');

        if (!response.ok) {
          throw new Error('Could not load products');
        }

        const data = await response.json();
        setProducts(data.slice(0, 4));
      } catch (error) {
        console.log(error);
        setError('Products are not available right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="home-container">
      <section className="hero-banner">
        <h1>Welcome to Kartio</h1>
        <p>Explore products and shop now.</p>
        <Link to="/shop" className="hero-banner-link">Shop Now</Link>
      </section>

      <section className="featured-section">
        <div className="section-heading">
          <h2>Featured Products</h2>
          <Link to="/shop">View all</Link>
        </div>

        {loading ? (
          <div className="loading-container" aria-live="polite">
            <div className="loading-spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : error ? (
          <div className="empty-products" role="status">
            <p>{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-products" role="status">
            <p>No products found.</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;
