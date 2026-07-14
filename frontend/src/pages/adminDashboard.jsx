import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
        <div style={{ padding: '2rem', minHeight: '80vh' }}>
            <h1>Admin Control Panel</h1>

            {loading ? (
                <div className="loading-container" style={{ minHeight: '220px' }}>
                    <div className="loading-spinner"></div>
                    <p>Loading dashboard...</p>
                </div>
            ) : (
                <>
                    {/* Small Compact Stats Row */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                        <SmallStat title="Users" value={stats.totalUsers} />
                        <SmallStat title="Products" value={stats.totalProducts} />
                        <SmallStat title="Orders" value={stats.totalOrders} />
                        <SmallStat title="Revenue" value={`₹${stats.totalRevenue}`} />
                    </div>
                </>
            )}

            {/* Navigation Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {navButtons.map((btn) => (
                    <button 
                        key={btn.title}
                        onClick={() => navigate(btn.path)}
                        style={{ padding: '1.5rem', cursor: 'pointer', backgroundColor: btn.color, color: '#fff', border: 'none', borderRadius: '8px' }}
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
    <div style={{ 
        padding: '0.5rem 1rem', 
        border: '1px solid #ddd', 
        borderRadius: '6px', 
        backgroundColor: '#f9f9f9',
        minWidth: '100px' 
    }}>
        <div style={{ fontSize: '0.8rem', color: '#666' }}>{title}</div>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{value}</div>
    </div>
);

export default AdminDashboard;