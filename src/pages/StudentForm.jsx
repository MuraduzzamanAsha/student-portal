import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { saveStudentProfile, getSessions } from '../api';

// Import all the dropdown options from your constants file
import { HALL_NAMES, BLOOD_GROUPS, GENDERS, PROGRAMS, DEPARTMENTS } from '../utils/constants';

const StudentForm = () => {
    // State for all form fields
    const [formData, setFormData] = useState({
        fullName: '',
        session: '',
        contactNumber: '',
        address: '',
        fathersName: '',
        nid: '',
        hall: HALL_NAMES[0],
        bloodGroup: BLOOD_GROUPS[0],
        gender: GENDERS[0],
        program: PROGRAMS[0],
        department: DEPARTMENTS[0],
        password: '',
        confirmPassword: '',
    });

    const [sessions, setSessions] = useState([]);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Fetch available sessions when the component loads
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const { data } = await getSessions();
                setSessions(data);
                if (data.length > 0) {
                    // Set the default session to the newest one (first in the list)
                    setFormData(prev => ({ ...prev, session: data[0].name }));
                }
            } catch (error) {
                console.error("Could not fetch sessions.");
                setError(error.response?.data?.message || "Could not load academic sessions. Please try again later.");
            }
        };
        fetchInitialData();
    }, []);

    // Handles changes for all text inputs and dropdowns
    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Handles the file selection for the profile photo
    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setProfilePhoto(e.target.files[0]);
        }
    };

    // Handles the final form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // --- Form Validations ---
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        if (!profilePhoto) {
            setError("Profile photo is required.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            // --- Step 1: Upload image to ImageBB ---
            const imageFormData = new FormData();
            imageFormData.append('key', import.meta.env.VITE_IMAGEBB_API_KEY);
            imageFormData.append('image', profilePhoto);

            const imgbbResponse = await axios.post('https://api.imgbb.com/1/upload', imageFormData);
            
            if (!imgbbResponse.data.success) {
                throw new Error('Image upload failed. Please try again.');
            }
            
            const photoURL = imgbbResponse.data.data.url;

            // --- Step 2: Send all data (including photo URL) to your backend ---
            await saveStudentProfile({ ...formData, profilePhotoUrl: photoURL });
            
            // On success, navigate to the profile view page
            navigate('/student/profile');
        } catch (err) {
            // Catches errors from both ImageBB and your own server
            setError(err.response?.data?.message || err.message || 'Failed to save profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container" style={{maxWidth: '700px'}}>
            <h2>Complete Your Profile</h2>
            <p className="info-text">Please fill out your information to complete registration.</p>
            <form onSubmit={handleSubmit}>
                {/* --- Personal & Academic Information --- */}
                <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input id="fullName" name="fullName" type="text" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="fathersName">Father's Name</label>
                    <input id="fathersName" name="fathersName" type="text" onChange={handleChange} required />
                </div>
                 <div className="form-group">
                    <label htmlFor="session">Session</label>
                    <select id="session" name="session" value={formData.session} onChange={handleChange} disabled={sessions.length === 0}>
                        {sessions.length > 0 ? (
                            sessions.map(s => <option key={s.id} value={s.name}>{s.name}</option>)
                        ) : (
                            <option>Loading sessions...</option>
                        )}
                    </select>
                </div>
                 <div className="form-group">
                    <label htmlFor="department">Department</label>
                    <select id="department" name="department" value={formData.department} onChange={handleChange}>
                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="program">Program</label>
                    <select id="program" name="program" value={formData.program} onChange={handleChange}>
                        {PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="hall">Hall</label>
                    <select id="hall" name="hall" value={formData.hall} onChange={handleChange}>
                        {HALL_NAMES.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                        {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="bloodGroup">Blood Group</label>
                    <select id="bloodGroup" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                        {BLOOD_GROUPS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="nid">NID Number</label>
                    <input id="nid" name="nid" type="text" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="contactNumber">Contact Number</label>
                    <input id="contactNumber" name="contactNumber" type="tel" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="address">Full Address</label>
                    <textarea id="address" name="address" onChange={handleChange} rows="3" required />
                </div>
                <div className="form-group">
                    <label htmlFor="profilePhoto">Profile Photo</label>
                    <input id="profilePhoto" type="file" accept="image/png, image/jpeg, image/jpg" onChange={handleFileChange} required />
                </div>
                
                {/* --- Password Section --- */}
                <hr style={{margin: '2rem 0', borderTop: '1px solid #eee'}}/>
                <h4>Set Your Password for Future Logins</h4>
                 <div className="form-group">
                    <label htmlFor="password">Password (min. 6 characters)</label>
                    <input id="password" type="password" name="password" onChange={handleChange} required minLength="6" />
                </div>
                 <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input id="confirmPassword" type="password" name="confirmPassword" onChange={handleChange} required />
                </div>

                <button type="submit" className="btn" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Profile'}
                </button>
                 {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default StudentForm;