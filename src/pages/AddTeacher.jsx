import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addTeacher } from '../api';

const AddTeacher = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await addTeacher({ name, email });
            setSuccess(`Teacher "${name}" added successfully!`);
            setName('');
            setEmail('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add teacher.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Add New Teacher</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Teacher's Full Name</label>
                    <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Teacher's Email</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <button type="submit" className="btn" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Teacher'}
                </button>
            </form>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
             <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{marginTop: '1rem'}}>
                Back to Dashboard
            </button>
        </div>
    );
};

export default AddTeacher;