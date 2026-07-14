import React, { useState, useEffect } from 'react';
import ProductCard from '../components/productCard';
const Shop = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(data);
        };
        fetchProducts();
    }, []);

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