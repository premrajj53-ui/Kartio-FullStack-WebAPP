import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import "../styles/MyOrders.css";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth(); 

    // Helper function to handle status colors based on your Mongoose enum
    const getStatusBadge = (status) => {
        switch(status?.toLowerCase()) {
            case 'pending':
                return { bg: '#fff3cd', color: '#856404', label: 'Pending' }; // Yellow
            case 'shipped':
                return { bg: '#cce5ff', color: '#004085', label: 'Shipped' }; // Blue
            case 'delivered':
                return { bg: '#d4edda', color: '#155724', label: 'Delivered' }; // Green
            case 'cancelled':
                return { bg: '#f8d7da', color: '#721c24', label: 'Cancelled' }; // Red
            default:
                return { bg: '#e2e3e5', color: '#383d41', label: status || 'Pending' }; // Grey fallback
        }
    };

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                // Hitting the specific /myOrders route from your backend
                const response = await fetch('/api/orders/myOrders', {
                    method: 'GET',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user?.token}` 
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setOrders(data);
                } else {
                    console.error("Failed to fetch orders:", data.message);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchMyOrders();
        }
    }, [user]);

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading orders...</div>;

    return (
        <main className="my-orders-container">
            <div className="my-orders-wrapper">
                <h1 className="my-orders-title">My Order History</h1>
                
                {orders.length === 0 ? (
                    <p className="no-orders-msg">You haven't placed any orders yet.</p>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => {
                            const badgeStyle = getStatusBadge(order.status);
                            
                            return (
                                <div key={order._id} className="order-card">
                                    <div className="order-info">
                                        <h3>Order #{order._id.substring(0, 8)}</h3>
                                        <p>
                                            <b>Date:</b> {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                        <p>
                                            {/* Reads from your backend's 'items' array */}
                                            <b>Items:</b> {order.items?.length || 0}
                                        </p>
                                    </div>
                                    
                                    <div className="order-price-section">
                                        <p className="order-price">
                                            ₹{order.totalPrice}
                                        </p>
                                        <span 
                                            className="status-badge"
                                            style={{ 
                                                backgroundColor: badgeStyle.bg,
                                                color: badgeStyle.color
                                            }}
                                        >
                                            {badgeStyle.label}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
};

export default MyOrders;