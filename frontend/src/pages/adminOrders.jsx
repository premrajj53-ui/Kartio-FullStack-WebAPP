import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminOrders.css';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/orders', {
                    headers: { 'Authorization': `Bearer ${user?.token}` }
                });
                const data = await res.json();
                setOrders(data);
            } catch (err) {
                console.error("Failed to fetch orders", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user]);

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const res = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}` 
                },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await res.json();
            if (!res.ok) {
                console.error("Backend Error:", data);
                alert(`Failed: ${data.message || "Unknown error"}`);
                return;
            }

            setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
            alert("Order status updated successfully!");
        } catch (err) {
            console.error("Network Error:", err);
            alert("Error updating status");
        }
    };

    if (loading) {
        return (
            <div className="admin-orders-container">
                <div className="loading-container" style={{ minHeight: '220px' }}>
                    <div className="loading-spinner"></div>
                    <p>Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-orders-container">
            <h1 className="admin-orders-title">Manage Orders</h1>
            <table className="admin-orders-table">
                <thead className="admin-orders-thead">
                    <tr className="admin-orders-header-row">
                        <th className="admin-orders-th">Order ID</th>
                        <th className="admin-orders-th">Total Price</th>
                        <th className="admin-orders-th">Current Status</th>
                        <th className="admin-orders-th">Update Status</th>
                    </tr>
                </thead>
                <tbody className="admin-orders-tbody">
                    {orders.map(order => (
                        <tr key={order._id} className="admin-orders-row">
                            <td className="admin-orders-td order-id-cell">
                                {order._id.substring(0, 8)}...
                            </td>
                            <td className="admin-orders-td order-price-cell">
                                ₹{order.totalPrice}
                            </td>
                            <td className="admin-orders-td order-status-cell">
                                <strong>{order.status}</strong>
                            </td>
                            <td className="admin-orders-td order-action-cell">
                                <select 
                                    className="status-select"
                                    value={order.status} 
                                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminOrders;