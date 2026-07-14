import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/cart.css';
import { removeFromCart } from '../redux/cartSlice';
const Cart = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [totalPrice, setTotalPrice] = useState(0);
  console.log("What is inside my cart?", cartItems);

  useEffect(() => {
    const calculateTotalPrice = () => {
      let total = 0;
      cartItems.forEach((item) => {
        total += item.price * item.quantity;
      });
      setTotalPrice(total);
    };
    calculateTotalPrice();
  }, [cartItems]);

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
};

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Your Cart</h2>
        <Link to="/checkout">        
          <button className="cart-btn">Checkout</button>
        </Link>
      </div>
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item._id} className="cart-item">
            <img src={item.imageUrl} alt={item.name} />
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p>{item.quantity} x ${item.price}</p>
            </div>
            <div className="cart-item-remove">
              <button onClick={() => handleRemoveItem(item.productId)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      {user && (
        <div className="cart-total">
          <h3>Total: ${totalPrice}</h3>
        </div>
      )}
    </div>
  );
};  

export default Cart;