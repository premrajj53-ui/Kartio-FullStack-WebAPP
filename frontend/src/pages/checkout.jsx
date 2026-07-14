import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/checkout.css';
import { clearCart } from '../redux/cartSlice';

const Checkout = () => {
  const { user } = useAuth();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 👉 UPDATED: Matches Mongoose schema perfectly
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    street: '',
    city: '',
    state: '',   // Added state
    zip: '',     // Renamed to zip
    country: '', 
  });
  
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
  const [placingOrder, setPlacingOrder] = useState(false);

  const handlePlaceOrder = async () => {
    // 1. Validations (Now checks for state and zip)
    if (cartItems.length === 0) {
      return alert("Your cart is empty!");
    }
    if (!shippingInfo.fullName || !shippingInfo.street || !shippingInfo.city || !shippingInfo.state || !shippingInfo.zip || !shippingInfo.country) {
      return alert("Please fill out all shipping details.");
    }

    try {
      setPlacingOrder(true);
      const formattedItems = cartItems.map((item) => ({
        productId: item._id || item.id || item.productId,
        name: item.name || item.title,
        price: Number(item.price),
        quantity: Number(item.quantity || 1),
      }));

      // 2. Package the order data
      const orderData = {
        items: formattedItems,
        address: {
          fullName: shippingInfo.fullName,
          street: shippingInfo.street,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zip: shippingInfo.zip,
          country: shippingInfo.country,
        },
        totalPrice: totalPrice,
        // No paymentId or paymentMethod needed here anymore!
      };
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}` 
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Could not place order');
      }

      dispatch(clearCart());
      alert('Order placed successfully!');
      navigate('/order-success');
      
    } catch (error) {
      console.error(error);
      alert(`Order failed: ${error.message}`);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <main className="checkout-container"> 
      <section className="checkout-header">      
        <h1>Secure Checkout</h1> 
      </section>
      
      <section className="checkout-body">
        <div className="checkout-body-left">
          <h2>Shipping Address</h2>
          
          <div className="checkout-form">
            <label>Full Name</label>
            <input type="text" value={shippingInfo.fullName} onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })} />
          </div>
          
          <div className="checkout-form">
            <label>Street</label>
            <input type="text" value={shippingInfo.street} onChange={(e) => setShippingInfo({ ...shippingInfo, street: e.target.value })} />
          </div>
          
          <div className="checkout-form">
            <label>City</label>
            <input type="text" value={shippingInfo.city} onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })} />
          </div>

          {/* 👉 NEW: State Field */}
          <div className="checkout-form">
            <label>State</label>
            <input type="text" value={shippingInfo.state} onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })} />
          </div>
          
          {/* 👉 UPDATED: Zip Field */}
          <div className="checkout-form">
            <label>Zip / Postal Code</label>
            <input type="text" value={shippingInfo.zip} onChange={(e) => setShippingInfo({ ...shippingInfo, zip: e.target.value })} />
          </div>
          
          <div className="checkout-form">
            <label>Country</label>
            <input type="text" value={shippingInfo.country} onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })} />
          </div>
          
          <div className="cod-info-box">
            <p className="cod-info-title">💵 Payment Method: Cash on Delivery (COD)</p>
            <p className="cod-info-subtitle">You will pay when the order arrives at your address.</p>
          </div>

          <button type="button" className="checkout-action" onClick={handlePlaceOrder} disabled={placingOrder}>
            {placingOrder ? 'Placing Order...' : 'Place Order Now'}
          </button>
        </div>
        
        <div className="checkout-body-right">
          <h2>Order Summary</h2>
          <div className="order-summary">            
            <div className="order-summary-item">
              <h3>Subtotal</h3>
              <p>₹{totalPrice}</p>
            </div>
            <div className="order-summary-item">
              <h3>Shipping</h3>
              <p>Free</p>
            </div>
            <div className="order-summary-item grand-total-row">
              <h3>Total to Pay</h3>
              <p className="grand-total-price">₹{totalPrice}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};  

export default Checkout;