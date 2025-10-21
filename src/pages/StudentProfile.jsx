import React, { useState, useEffect } from 'react';
import { getStudentProfile } from '../api';
import { useNavigate } from 'react-router-dom';

// --- Inline CSS for the ID Card styling ---
// We do this here to keep the component self-contained and easy to manage.
const styles = {
    cardContainer: {
        maxWidth: '450px',
        margin: '2rem auto',
        padding: 0,
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px -10px rgba(0, 56, 179, 0.2)',
        fontFamily: "'Inter', sans-serif",
        background: '#ffffff',
    },
    header: {
        background: 'linear-gradient(90deg, #0056b3 0%, #004494 100%)',
        color: 'white',
        padding: '1.5rem',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
    },
    logo: {
        height: '50px',
        width: '50px',
    },
    universityName: {
        margin: 0,
        fontSize: '1.2rem',
        fontWeight: 600,
    },
    content: {
        padding: '2rem',
        textAlign: 'center',
    },
    profilePhotoContainer: {
        marginTop: '-50px', // Pulls the photo up to overlap the header
        marginBottom: '1rem',
    },
    profilePhoto: {
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        border: '5px solid white',
        boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
        objectFit: 'cover',
    },
    studentName: {
        margin: '0.5rem 0',
        fontSize: '1.75rem',
        fontWeight: '700',
        color: '#004494',
    },
    studentRoll: {
        margin: 0,
        fontSize: '1rem',
        color: '#6c757d',
        fontWeight: 500,
        marginBottom: '2rem',
    },
    infoGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.25rem',
        textAlign: 'left',
    },
    infoItem: {
        paddingBottom: '0.75rem',
        borderBottom: '1px solid #f0f2f5'
    },
    infoLabel: {
        display: 'block',
        fontSize: '0.8rem',
        color: '#6c757d',
        fontWeight: 500,
        marginBottom: '0.25rem',
    },
    infoValue: {
        fontSize: '1rem',
        fontWeight: 600,
        color: '#333',
    },
    footer: {
        background: '#f0f2f5',
        textAlign: 'center',
        padding: '1rem',
    },
};

const StudentProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await getStudentProfile();
                setProfile(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Could not fetch profile.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <p className="text-center" style={{marginTop: '4rem'}}>Loading your ID Card...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div>
            {profile ? (
                <div style={styles.cardContainer}>
                    {/* --- Card Header --- */}
                    <header style={styles.header}>
                        <img 
                            src="../../public/vite.png"
                            alt="University Logo" 
                            style={styles.logo} 
                        />
                        <div>
                            <h2 style={styles.universityName}>Mawlana Bhashani Science and Technology University</h2>
                        </div>
                    </header>

                    {/* --- Card Body --- */}
                    <main style={styles.content}>
                        <div style={styles.profilePhotoContainer}>
                            <img 
                                src={profile.profilePhotoUrl} 
                                alt={`${profile.fullName}'s profile`}
                                style={styles.profilePhoto} 
                            />
                        </div>

                        <h1 style={styles.studentName}>{profile.fullName}</h1>
                        <p style={styles.studentRoll}>Roll: {profile.rollNumber}</p>

                        <div style={styles.infoGrid}>
                            <div style={styles.infoItem}>
                                <span style={styles.infoLabel}>Session</span>
                                <span style={styles.infoValue}>{profile.session}</span>
                            </div>
                            <div style={styles.infoItem}>
                                <span style={styles.infoLabel}>Program</span>
                                <span style={styles.infoValue}>{profile.program}</span>
                            </div>
                            <div style={styles.infoItem}>
                                <span style={styles.infoLabel}>Department</span>
                                <span style={styles.infoValue}>{profile.department}</span>
                            </div>
                            <div style={styles.infoItem}>
                                <span style={styles.infoLabel}>Hall</span>
                                <span style={styles.infoValue}>{profile.hall}</span>
                            </div>
                            <div style={styles.infoItem}>
                                <span style={styles.infoLabel}>Father's Name</span>
                                <span style={styles.infoValue}>{profile.fathersName}</span>
                            </div>
                            <div style={styles.infoItem}>
                                <span style={styles.infoLabel}>Blood Group</span>
                                <span style={{...styles.infoValue, color: '#d32f2f'}}>{profile.bloodGroup}</span>
                            </div>
                            <div style={styles.infoItem}>
                                <span style={styles.infoLabel}>Gender</span>
                                <span style={styles.infoValue}>{profile.gender}</span>
                            </div>
                            <div style={styles.infoItem}>
                                <span style={styles.infoLabel}>NID</span>
                                <span style={styles.infoValue}>{profile.nid}</span>
                            </div>
                        </div>
                    </main>

                    {/* --- Card Footer & Update Button --- */}
                    <footer style={styles.footer}>
                        <button 
                            className="btn" 
                            style={{width: 'auto'}}
                            onClick={() => navigate('/student/edit-profile')}
                        >
                            Update Information
                        </button>
                    </footer>
                </div>
            ) : (
                <p className="text-center">No profile information found. Please complete your registration.</p>
            )}
        </div>
    );
};

export default StudentProfile;