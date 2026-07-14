import React, { useState, useEffect } from 'react';
import ProductCard from '../components/productCard';
const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                console.error('Failed to load products', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div style={{ padding: '2rem' }}>
                <div className="loading-container" style={{ minHeight: '220px' }}>
                    <div className="loading-spinner"></div>
                    <p>Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Our Products</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
                {products.map(product => (
                    // Reusing your existing component here
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default Shop;