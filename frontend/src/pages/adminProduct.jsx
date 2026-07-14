import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminProduct.css'; // Correct relative path

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                console.error('Failed to fetch products', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const deleteProduct = async (id) => {
        if (window.confirm("Delete this product?")) {
            await fetch(`/api/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user?.token}` }
            });
            setProducts(products.filter(p => p._id !== id));
        }
    };

    if (loading) {
        return (
            <div className="admin-products-container">
                <div className="loading-container" style={{ minHeight: '220px' }}>
                    <div className="loading-spinner"></div>
                    <p>Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-products-container">
            <h1 className="admin-products-title">Manage Products</h1>
            <table className="admin-products-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p._id}>
                            <td>
                                <img src={p.imageUrl} alt={p.name} className="admin-product-img" />
                            </td>
                            <td>{p.name}</td>
                            <td>₹{p.price}</td>
                            <td>{p.category}</td>
                            <td>{p.stock}</td>

                            <td>
                                <button className="action-btn edit-btn" onClick={() => navigate(`/admin/edit-product/${p._id}`)}>Edit</button>
                                <button className="action-btn delete-btn" onClick={() => deleteProduct(p._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default AdminProducts;