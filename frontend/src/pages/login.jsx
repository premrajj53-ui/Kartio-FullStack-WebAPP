import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import "../styles/auth.css";

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth(); 
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        setLoading(true);
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            login(data.user || data); 
            navigate('/');
        } else {
            // Check if the backend sent our custom 'notVerified' flag
            if (data.notVerified) {
                alert("Your account is not verified. Redirecting to OTP page...");
                // Send them to the verify page and pass the email along
                navigate('/verify', { state: { email: data.email } });
            } else {
                // For regular errors (like wrong password)
                alert(data.message || 'Invalid email or password');
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Something went wrong during login.');
    } finally {
        setLoading(false);
    }
};
    return (
        <main className="auth-container">
            <div className="auth-card">                
                <h1 className="auth-title">Welcome Back</h1>
                <p className="auth-subtitle">Log in to your Kartio account</p>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? 'Logging In...' : 'Log In'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/register" className="auth-link">Sign up</Link></p>
                </div>
            </div>
        </main>
    );
};  

export default Login;