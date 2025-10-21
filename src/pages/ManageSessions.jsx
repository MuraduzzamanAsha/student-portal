import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSessions, addSession, deleteSession } from '../api';

const ManageSessions = () => {
    const [sessions, setSessions] = useState([]);
    const [newSessionName, setNewSessionName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchSessions = async () => {
        try {
            const { data } = await getSessions();
            setSessions(data);
        } catch (err) {
            setError(err.message() || 'Failed to fetch sessions.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleAddSession = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await addSession({ name: newSessionName });
            setNewSessionName(''); // Clear input
            fetchSessions(); // Refresh the list
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add session.');
        }
    };

    const handleDelete = async (sessionId) => {
        if (window.confirm('Are you sure you want to delete this session?')) {
            try {
                await deleteSession(sessionId);
                fetchSessions(); // Refresh the list
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete session.');
            }
        }
    };

    return (
        <div>
            <div className="form-container" style={{ maxWidth: '600px' }}>
                <h2>Manage Academic Sessions</h2>
                <form onSubmit={handleAddSession}>
                    <div className="form-group">
                        <label htmlFor="sessionName">New Session (YYYY-YYYY)</label>
                        <input
                            id="sessionName"
                            type="text"
                            value={newSessionName}
                            onChange={(e) => setNewSessionName(e.target.value)}
                            placeholder="e.g., 2025-2026"
                            required
                        />
                    </div>
                    <button type="submit" className="btn">Add Session</button>
                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>

            <div className="table-container" style={{ maxWidth: '600px', margin: '2rem auto' }}>
                <h3>Existing Sessions</h3>
                {loading ? <p>Loading...</p> : (
                    <table>
                        <tbody>
                            {sessions.map(session => (
                                <tr key={session.id}>
                                    <td>{session.name}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button onClick={() => handleDelete(session.id)} className="btn btn-danger">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
             <div className="text-center">
                 <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{width: 'auto'}}>
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default ManageSessions;