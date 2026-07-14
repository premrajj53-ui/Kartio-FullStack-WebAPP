import React from "react";
import { Link } from "react-router-dom";
import "../styles/productCard.css";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`}>
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="product-card-image" 
        />
      </Link>
      <div className="product-card-info">
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-price">₹{product.price}</p>
        
        {/* Fixed: Removed the "s" from "products" so the route matches the image link */}
        <Link to={`/product/${product._id}`} className="product-card-link">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;