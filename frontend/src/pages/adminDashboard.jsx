import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/adminDashboard.css'; // Make sure this path matches your folder structure!

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0 });
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/analytics', {
                    headers: { 'Authorization': `Bearer ${user?.token}` }
                });
                const data = await res.json();
                setStats(data);
            } catch (err) {
                console.error("Failed to fetch stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [user]);

    const navButtons = [
        { title: 'Manage Orders', path: '/admin/orders', color: '#ff9800' },
        { title: 'Manage Products', path: '/admin/products', color: '#2196f3' },
        { title: 'Add New Product', path: '/admin/addproduct', color: '#4caf50' },
        { title: 'Manage Users', path: '/admin/users', color: '#9c27b0' },
    ];

    return (
        <div className="admin-dashboard-container">
            <h1 className="admin-title">Admin Control Panel</h1>

            {loading ? (
                <div className="loading-container" style={{ minHeight: '220px' }}>
                    <div className="loading-spinner"></div>
                    <p>Loading dashboard...</p>
                </div>
            ) : (
                <>
                    {/* Compact Stats Row */}
                    <div className="admin-stats-container">
                        <SmallStat title="Users" value={stats.totalUsers} />
                        <SmallStat title="Products" value={stats.totalProducts} />
                        <SmallStat title="Orders" value={stats.totalOrders} />
                        <SmallStat title="Revenue" value={`₹${stats.totalRevenue}`} />
                    </div>
                </>
            )}

            {/* Navigation Grid */}
            <div className="admin-nav-grid">
                {navButtons.map((btn) => (
                    <button 
                        key={btn.title}
                        onClick={() => navigate(btn.path)}
                        className="admin-nav-btn"
                        style={{ backgroundColor: btn.color }}
                    >
                        {btn.title}
                    </button>
                ))}
            </div>
        </div>
    );
};

// Compact Stat component
const SmallStat = ({ title, value }) => (
    <div className="admin-stat-card">
        <div className="admin-stat-title">{title}</div>
        <div className="admin-stat-value">{value}</div>
    </div>
);

export default AdminDashboard;