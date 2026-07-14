import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminUsers.css'; 

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/auth/users', { // Ensure this route is correct
                    headers: { 'Authorization': `Bearer ${user?.token}` }
                });
                const data = await res.json();
                setUsers(data);
            } catch (err) {
                console.error('Failed to fetch users', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [user]);

    const deleteUser = async (id) => {
        if (window.confirm("Delete this user?")) {
            await fetch(`/api/auth/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user?.token}` }
            });
            setUsers(users.filter(u => u._id !== id));
        }
    };

    if (loading) {
        return (
            <div className="admin-users-container">
                <div className="loading-container" style={{ minHeight: '220px' }}>
                    <div className="loading-spinner"></div>
                    <p>Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-users-container">
            <h1 className="admin-users-title">Manage Users</h1>
            <table className="admin-users-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u._id}>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td><span className={`role-badge ${u.role === 'admin' ? 'admin-role' : 'user-role'}`}>{u.role || 'user'}</span></td>
                            <td>
                                <button className="action-btn delete-btn" onClick={() => deleteUser(u._id)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default AdminUsers;