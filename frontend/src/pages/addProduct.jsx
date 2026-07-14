import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/AddProduct.css'; // Make sure this import is added!

const AddProduct = () => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        stock: ''
    });
    const [file, setFile] = useState(null); // State for the actual file
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Create FormData to handle the file and text data
        const data = new FormData();
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('description', formData.description);
        data.append('category', formData.category);
        data.append('stock', formData.stock);
        if (file) {
            data.append('image', file); // 'image' MUST match the name in upload.single('image')
        }

        try {
            setLoading(true);
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${user?.token}` 
                    // Do NOT set Content-Type; browser handles it for FormData
                },
                body: data
            });

            if (res.ok) {
                alert("Product uploaded successfully!");
                navigate('/admin/products');
            } else {
                const errorData = await res.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (err) {
            console.error("Upload failed:", err);
            alert("Error connecting to server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-product-container">
            <h2 className="add-product-title">Add New Product</h2>
            
            <form className="add-product-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Product Name</label>
                    <input placeholder="Name" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                
                <div className="form-group row-group">
                    <div className="half-width">
                        <label>Price (₹)</label>
                        <input placeholder="Price" type="number" onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                    </div>
                    <div className="half-width">
                        <label>Stock</label>
                        <input placeholder="Stock" type="number" onChange={(e) => setFormData({...formData, stock: e.target.value})} required />
                    </div>
                </div>

                <div className="form-group">
                    <label>Category</label>
                    <input placeholder="Category" onChange={(e) => setFormData({...formData, category: e.target.value})} required />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea placeholder="Description" rows="4" onChange={(e) => setFormData({...formData, description: e.target.value})} required />
                </div>
                
                <div className="form-group">
                    <label>Upload Product Image:</label>
                    <input 
                        className="file-input"
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => setFile(e.target.files[0])} 
                        required
                    />
                </div>
                
                <button className="submit-btn" type="submit" disabled={loading}>
                    {loading ? 'Uploading...' : 'Upload Product'}
                </button>
            </form>
        </div>
    );
};

export default AddProduct;