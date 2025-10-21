import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendStudentOtp, verifyStudentOtp, loginStudentWithPassword } from '../api';
import { useAuth } from '../hooks/useAuth.jsx';

const StudentLogin = () => {
    const [loginMethod, setLoginMethod] = useState('password'); // 'otp' or 'password', default to password
    const [rollNumber, setRollNumber] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    // A helper function to handle navigation after any successful login
    const handleNavigation = (data) => {
        login(data.token);
        if (data.profileComplete) {
            navigate('/student/profile');
        } else {
            navigate('/student/new-profile');
        }
    };

    // --- OTP Login Handlers ---
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await sendStudentOtp({ rollNumber });
            setShowOtpInput(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await verifyStudentOtp({ rollNumber, otp });
            handleNavigation(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP.');
        } finally {
            setLoading(false);
        }
    };

    // --- Password Login Handler ---
    const handlePasswordLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await loginStudentWithPassword({ rollNumber, password });
            handleNavigation(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please check your roll number and password.');
        } finally {
            setLoading(false);
        }
    };

    // --- Render Functions for Forms ---
    const renderOtpForm = () => (
        !showOtpInput ? (
            <form onSubmit={handleSendOtp}>
                <p className="info-text">Use OTP for your first login or if you've forgotten your password.</p>
                 <div className="form-group">
                    <label htmlFor="roll-otp">Academic Roll Number</label>
                    <input id="roll-otp" type="text" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} required placeholder="e.g., IT18001" />
                </div>
                <button type="submit" className="btn" disabled={loading}>{loading ? 'Sending...' : 'Send OTP'}</button>
            </form>
        ) : (
            <form onSubmit={handleVerifyOtp}>
                <p className="info-text">An OTP has been sent to the email for roll <strong>{rollNumber}</strong>.</p>
                <div className="form-group">
                     <label htmlFor="otp">One-Time Password (OTP)</label>
                    <input id="otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength="6" placeholder="Enter 6-digit OTP" />
                </div>
                <button type="submit" className="btn" disabled={loading}>{loading ? 'Verifying...' : 'Login with OTP'}</button>
            </form>
        )
    );

    const renderPasswordForm = () => (
        <form onSubmit={handlePasswordLogin}>
             <div className="form-group">
                <label htmlFor="roll-pw">Academic Roll Number</label>
                <input id="roll-pw" type="text" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} required placeholder="e.g., IT18001" />
            </div>
             <div className="form-group">
                <label htmlFor="password">Password</label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password" />
            </div>
            <button type="submit" className="btn" disabled={loading}>{loading ? 'Logging in...' : 'Login with Password'}</button>
        </form>
    );

    return (
        <div className="form-container">
            <h2>Student Login</h2>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
                <button onClick={() => setLoginMethod('password')} className={loginMethod === 'password' ? 'btn' : 'btn btn-secondary'} style={{ flex: 1, borderRadius: '0', border: 'none' }}>Login with Password</button>
                <button onClick={() => setLoginMethod('otp')} className={loginMethod === 'otp' ? 'btn' : 'btn btn-secondary'} style={{ flex: 1, borderRadius: '0', border: 'none' }}>Login with OTP</button>
            </div>

            {loginMethod === 'otp' ? renderOtpForm() : renderPasswordForm()}

            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default StudentLogin;