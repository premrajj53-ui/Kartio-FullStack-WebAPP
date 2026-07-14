import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import "../styles/auth.css"; 

const VerifyEmail = () => {
    const [otp, setOtp] = useState('');
    const [isResending, setIsResending] = useState(false); // Prevents button spamming
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    
    // Grab the email that was passed from the Register or Login component
    const location = useLocation();
    const email = location.state?.email; 

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            alert("No email found. Please try registering or logging in again.");
            return navigate('/login');
        }

        try {
            setLoading(true);
            const response = await fetch('/api/auth/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();

            if (response.ok) {
                // Email is verified and backend sent the token! Log them in.
                login(data.user || data); 
                alert("Email verified successfully!");
                navigate('/'); 
            } else {
                alert(data.message || "Invalid OTP. Please try again.");
            }
        } catch (error) {
            console.error("Verification error:", error);
            alert("Something went wrong during verification.");
        } finally {
            setLoading(false);
        }
    };

    // --- NEW FUNCTION: Resend OTP ---
    const handleResendOtp = async () => {
        if (!email) {
            alert("No email found to resend OTP.");
            return;
        }

        setIsResending(true);
        try {
            // NOTE: Double check what your backend route for resending is actually named! 
            // Update '/api/auth/resend-otp' if your backend calls it something else.
            const response = await fetch('/api/auth/resend-verification-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("A new OTP has been sent to your email!");
            } else {
                alert(data.message || "Could not resend OTP.");
            }
        } catch (error) {
            console.error("Resend OTP error:", error);
            alert("Something went wrong while trying to resend the OTP.");
        } finally {
            setIsResending(false); // Re-enable the button
        }
    };

    return (
        <main className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Verify Your Email</h1>
                <p className="auth-subtitle">We sent a 6-digit OTP to <b>{email || "your email"}</b></p>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="otp">Enter OTP</label>
                        <input
                            type="text"
                            id="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="form-input"
                            maxLength="6"
                            placeholder="123456"
                            required
                        />
                    </div>
                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify & Log In'}
                    </button>
                </form>

                {/* --- NEW SECTION: Resend OTP Button --- */}
                <div className="auth-footer" style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.9rem', color: '#666' }}>
                        Didn't receive the code?{' '}
                        <button 
                            type="button" 
                            onClick={handleResendOtp} 
                            disabled={isResending || loading}
                            style={{ 
                                background: 'none', 
                                border: 'none', 
                                color: '#007BFF', 
                                cursor: isResending ? 'not-allowed' : 'pointer',
                                textDecoration: 'underline',
                                fontWeight: 'bold'
                            }}
                        >
                            {isResending ? "Sending..." : "Resend OTP"}
                        </button>
                    </p>
                </div>
                
            </div>
        </main>
    );
};

export default VerifyEmail;