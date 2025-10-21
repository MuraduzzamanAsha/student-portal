import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendTeacherOtp, verifyTeacherOtp } from '../api';
import { useAuth } from '../hooks/useAuth.jsx';

const TeacherLogin = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await sendTeacherOtp({ email });
            setShowOtpInput(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please check the email.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await verifyTeacherOtp({ email, otp });
            login(data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Teacher & Admin Login</h2>
            {!showOtpInput ? (
                <form onSubmit={handleSendOtp}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your registered email"
                            required
                        />
                    </div>
                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleVerifyOtp}>
                    <p className="info-text">An OTP has been sent to <strong>{email}</strong>.</p>
                    <div className="form-group">
                         <label htmlFor="otp">One-Time Password (OTP)</label>
                        <input
                            id="otp"
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter 6-digit OTP"
                            required
                            maxLength="6"
                        />
                    </div>
                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? 'Verifying...' : 'Login'}
                    </button>
                </form>
            )}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default TeacherLogin;