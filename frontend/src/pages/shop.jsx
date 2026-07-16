import React, { useState, useEffect } from 'react';
import ProductCard from '../components/productCard';
import '../styles/searchResult.css';

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
            <div className="page-shell">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Our Products</h1>
                        <p className="page-subtitle">Discover a curated collection of quality items.</p>
                    </div>
                </div>
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-shell">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Our Products</h1>
                    <p className="page-subtitle">Discover a curated collection of quality items.</p>
                </div>
            </div>

            {products.length === 0 ? (
                <div className="empty-state">
                    <p>No products are available right now.</p>
                </div>
            ) : (
                <div className="product-grid">
                    {products.map(product => (
                        <div key={product._id}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Shop;