import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getStudentProfile, saveStudentProfile, getSessions } from '../api';
import { HALL_NAMES, BLOOD_GROUPS, GENDERS, PROGRAMS, DEPARTMENTS } from '../utils/constants';

const EditStudentProfile = () => {
    // State starts as null to indicate that we are fetching initial data
    const [formData, setFormData] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [profilePhoto, setProfilePhoto] = useState(null); // For handling a new file upload
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Fetch the student's current profile data when the component loads
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileRes = await getStudentProfile();
                setFormData(profileRes.data); // Pre-fill the form with existing data
                
                const sessionsRes = await getSessions();
                setSessions(sessionsRes.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load your profile data. Please try again.");
            }
        };
        fetchProfile();
    }, []); // Empty dependency array means this runs only once on mount

    // Handles changes for all text inputs and dropdowns
    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Handles the file selection for a new profile photo
    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setProfilePhoto(e.target.files[0]);
        }
    };

    // Handles the final form submission to update the profile
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let updatedData = { ...formData };

            // If a new photo was chosen, upload it to ImageBB and get the new URL
            if (profilePhoto) {
                const imageFormData = new FormData();
                imageFormData.append('key', import.meta.env.VITE_IMAGEBB_API_KEY);
                imageFormData.append('image', profilePhoto);

                const imgbbResponse = await axios.post('https://api.imgbb.com/1/upload', imageFormData);
                if (!imgbbResponse.data.success) {
                    throw new Error('Image upload failed.');
                }
                // Overwrite the old photo URL with the new one
                updatedData.profilePhotoUrl = imgbbResponse.data.data.url;
            }

            // Send all data to the backend. The backend's `set({ merge: true })` will handle updating.
            await saveStudentProfile(updatedData);
            
            // Navigate back to the profile view page on success
            navigate('/student/profile');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    // Show a loading message while fetching the initial profile data
    if (!formData) {
        return <p className="text-center" style={{marginTop: '4rem'}}>Loading your information for editing...</p>;
    }

    return (
        <div className="form-container" style={{maxWidth: '700px'}}>
            <h2>Update Your Profile Information</h2>
            <form onSubmit={handleSubmit}>
                {/* --- Personal & Academic Information --- */}
                <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input id="fullName" name="fullName" type="text" value={formData.fullName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="fathersName">Father's Name</label>
                    <input id="fathersName" name="fathersName" type="text" value={formData.fathersName} onChange={handleChange} required />
                </div>
                 <div className="form-group">
                    <label htmlFor="session">Session</label>
                    <select id="session" name="session" value={formData.session} onChange={handleChange}>
                         {sessions.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
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
                    <input id="nid" name="nid" type="text" value={formData.nid} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="contactNumber">Contact Number</label>
                    <input id="contactNumber" name="contactNumber" type="tel" value={formData.contactNumber} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="address">Full Address</label>
                    <textarea id="address" name="address" value={formData.address} onChange={handleChange} rows="3" required />
                </div>
                <div className="form-group">
                    <label>Current Profile Photo</label>
                    <div>
                        <img src={formData.profilePhotoUrl} alt="Current profile" style={{width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover'}}/>
                    </div>
                    <label htmlFor="newProfilePhoto" style={{marginTop: '1rem', display: 'block'}}>Upload a New Photo (Optional)</label>
                    <input id="newProfilePhoto" type="file" accept="image/png, image/jpeg, image/jpg" onChange={handleFileChange} />
                </div>

                {/* Note: Password fields are intentionally omitted from an "edit profile" form for security. */}
                {/* A "change password" feature should be a separate, dedicated form. */}

                <div style={{display: 'flex', gap: '1rem', marginTop: '1.5rem'}}>
                    <button type="submit" className="btn" disabled={loading} style={{flex: 1}}>
                        {loading ? 'Saving Changes...' : 'Save Changes'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/student/profile')} style={{flex: 1}}>
                        Cancel
                    </button>
                </div>
                 {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default EditStudentProfile;