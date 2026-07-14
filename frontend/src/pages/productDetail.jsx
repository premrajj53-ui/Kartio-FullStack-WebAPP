import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import '../styles/productDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        console.log("Raw Backend Data:", data);
        setProduct(data);
      } catch (error) {
        console.log("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({
        productId: product._id, // Fixed: Using _id to match MongoDB
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        description: product.description,
        category: product.category,
        quantity: 1, // Usually, you add 1 unit to the cart at a time
      }));
      alert('Product added to cart');
    }
  };

  // Fixed: Prevent the app from crashing while waiting for data
  if (loading) {
    return <div className="product-detail-container"><h2>Loading product...</h2></div>;
  }

  // Fixed: Handle the case where a product ID doesn't exist
  if (!product) {
    return <div className="product-detail-container"><h2>Product not found.</h2></div>;
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail">
        <h1>{product.name}</h1>
        <img src={product.imageUrl} alt={product.name} />
        <p>{product.description}</p>
        <p>Price: ₹{product.price}</p>
        <p>Category: {product.category}</p>
        <p>Stock: {product.stock}</p>
        <button onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductDetail;