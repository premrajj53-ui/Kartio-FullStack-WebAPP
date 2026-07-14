import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AddProduct.css'; // Reusing your AddProduct styles for a consistent UI

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    // 1. State for text fields and a separate state for a new file
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        stock: ''
    });
    const [file, setFile] = useState(null);
    const [currentImage, setCurrentImage] = useState(''); // To show the existing image
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);

    // 2. Fetch current product details on load
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                const data = await res.json();
                
                // Populate the form with existing data
                setFormData({
                    name: data.name || '',
                    price: data.price || '',
                    description: data.description || '',
                    category: data.category || '',
                    stock: data.stock || ''
                });
                setCurrentImage(data.imageUrl); // Store existing image URL
            } catch (err) {
                console.error("Failed to fetch product details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="loading-container" style={{ minHeight: '220px', textAlign: 'center' }}>
                <div className="loading-spinner"></div>
                <p>Loading product details...</p>
            </div>
        );
    }

    // 3. Submit updated details using FormData
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = new FormData();
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('description', formData.description);
        data.append('category', formData.category);
        data.append('stock', formData.stock);
        
        // Only append a new image if the user selected one
        if (file) {
            data.append('image', file); 
        }

        try {
            setSubmitLoading(true);
            const res = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: { 
                    // NO 'Content-Type' header here. The browser handles it for FormData.
                    'Authorization': `Bearer ${user?.token}` 
                },
                body: data
            });

            if (res.ok) {
                alert("Product updated successfully!");
                navigate('/admin/products');
            } else {
                const errorData = await res.json();
                alert(`Failed to update product: ${errorData.message}`);
            }
        } catch (err) {
            console.error(err);
            alert("Network error occurred.");
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div className="add-product-container">
            <h2 className="add-product-title">Edit Product</h2>
            
            <form className="add-product-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Product Name</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                
                <div className="form-group row-group">
                    <div className="half-width">
                        <label>Price (₹)</label>
                        <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                    </div>
                    <div className="half-width">
                        <label>Stock / Quantity</label>
                        <input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} required />
                    </div>
                </div>
                
                <div className="form-group">
                    <label>Category</label>
                    <input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required />
                </div>
                
                <div className="form-group">
                    <label>Description</label>
                    <textarea rows="4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
                </div>
                
                <div className="form-group">
                    <label>Update Product Image (Optional)</label>
                    {/* Show the existing image if no new file is selected */}
                    {currentImage && !file && (
                        <div style={{ marginBottom: '1rem' }}>
                            <img src={currentImage} alt="Current" style={{ width: '100px', borderRadius: '4px' }} />
                        </div>
                    )}
                    <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="file-input" />
                    <small style={{ color: '#666' }}>Leave empty to keep the current image.</small>
                </div>
                
                <button type="submit" className="submit-btn" disabled={submitLoading}>
                    {submitLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};

export default EditProduct;