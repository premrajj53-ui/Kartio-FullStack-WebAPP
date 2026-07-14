import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/orderSuccess.css';

const OrderSuccess = () => {
  return (
    <main className="success-container">
      <div className="success-card">
        <div className="success-icon-wrapper">
          <span className="success-icon">✓</span>
        </div>
        
        <h1>Order Placed Successfully!</h1>
        <p className="success-message">
          Thank you for shopping with Kartio. Your order has been received and is currently being processed.
        </p>
        
        <div className="success-cod-note">
          <p><strong>Payment Method:</strong> Cash on Delivery (COD)</p>
          <p>Please keep the cash ready at the time of delivery.</p>
        </div>

        <Link to="/" className="continue-shopping-btn">
          Continue Shopping
        </Link>
      </div>
    </main>
  );
};

export default OrderSuccess;