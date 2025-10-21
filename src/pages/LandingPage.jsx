import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="form-container" style={{ textAlign: 'center' }}>
            <h2>Welcome to the Portal</h2>
            <p className="info-text">Please select your role to login.</p>
            <div className="form-group">
                <button onClick={() => navigate('/login/teacher')} className="btn">
                    Teacher / Admin Login
                </button>
            </div>
            <div className="form-group">
                <button onClick={() => navigate('/login/student')} className="btn btn-secondary">
                    Student Login
                </button>
            </div>
        </div>
    );
};

export default LandingPage;