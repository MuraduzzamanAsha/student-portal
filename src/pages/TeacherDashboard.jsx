import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudents, getPendingStudents, approveStudent, rejectStudent, deleteStudent, exportStudents } from '../api';
import { useAuth } from '../hooks/useAuth.jsx';
import fileDownload from 'js-file-download';
import FilterModal from '../components/common/FilterModal';

const TeacherDashboard = () => {
    const [students, setStudents] = useState([]);
    const [pendingStudents, setPendingStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isFilterModalOpen, setFilterModalOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState({}); // Stores { session, hall, department }
    const { user } = useAuth();
    const navigate = useNavigate();

    // The single, primary function to fetch all necessary data for the dashboard
    const fetchAllData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            // Clean up filters to remove any empty values before creating the query string
            const cleanFilters = Object.fromEntries(
                Object.entries(activeFilters).filter(([, v]) => v !== '' && v !== null)
            );
            const filterParams = new URLSearchParams(cleanFilters).toString();
            
            // Fetch both pending and approved (with filters) students at the same time
            const [approvedRes, pendingRes] = await Promise.all([
                getStudents(filterParams),
                getPendingStudents()
            ]);

            setStudents(approvedRes.data);
            setPendingStudents(pendingRes.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Could not fetch student data.');
        } finally {
            setLoading(false);
        }
    }, [activeFilters]); // This function re-runs only when the filters change

    // This effect triggers the data fetch when the component loads or when filters are updated
    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    // --- Action Handlers ---

    const handleApplyFilters = (filters) => {
        setActiveFilters(filters);
    };

    const handleApprove = async (studentId) => {
        try {
            await approveStudent(studentId);
            fetchAllData(); // Refresh both lists after an action
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to approve student.');
        }
    };
    
    const handleReject = async (studentId, studentName) => {
        if (window.confirm(`Are you sure you want to reject and delete the submission from ${studentName}?`)) {
            try {
                await rejectStudent(studentId);
                fetchAllData(); // Refresh both lists
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to reject student.');
            }
        }
    };
    
    const handleDelete = async (studentId, studentName) => {
        if (window.confirm(`Are you sure you want to permanently delete student: ${studentName}?`)) {
            try {
                await deleteStudent(studentId);
                fetchAllData(); // Refresh both lists
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete student.');
            }
        }
    };
    
    const handleExport = async () => {
        try {
            const response = await exportStudents();
            fileDownload(response.data, 'student-list.xlsx');
        } catch (err) {
            // Corrected error handling: err.message is a string, not a function
            alert(err.message || 'Failed to export data.');
        }
    };

    if (loading) return <p className="text-center">Loading dashboard...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div>
            <h1>Dashboard</h1>

            {user.role === 'admin' && (
                <div style={{marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem'}}>
                    <button onClick={() => navigate('/admin/add-teacher')} className="btn" style={{width: 'auto'}}>+ Add Teacher</button>
                    <button onClick={() => navigate('/admin/manage-sessions')} className="btn btn-secondary" style={{width: 'auto'}}>Manage Sessions</button>
                </div>
            )}

            {/* --- PENDING APPROVALS SECTION --- */}
            <div className="table-container" style={{ marginBottom: '3rem' }}>
                <h2 style={{color: 'var(--primary-color)'}}>Pending Approvals ({pendingStudents.length})</h2>
                {pendingStudents.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Roll Number</th>
                                <th>Session</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingStudents.map(student => (
                                <tr key={student.id}>
                                    <td>{student.fullName}</td>
                                    <td>{student.rollNumber}</td>
                                    <td>{student.session}</td>
                                    <td>
                                        <button onClick={() => handleApprove(student.id)} className="btn" style={{width: 'auto', marginRight: '0.5rem'}}>Approve</button>
                                        <button onClick={() => handleReject(student.id, student.fullName)} className="btn btn-danger" style={{width: 'auto'}}>Reject</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : <p>No new student registrations are pending.</p>}
            </div>

            {/* --- APPROVED STUDENTS SECTION --- */}
            <div className="table-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h2>Approved Students ({students.length})</h2>
                    <div>
                        <button onClick={() => setFilterModalOpen(true)} className="btn" style={{width: 'auto', marginRight: '1rem'}}>Filter</button>
                        <button onClick={handleExport} className="btn btn-secondary" style={{width: 'auto'}}>Download List</button>
                    </div>
                </div>
                
                <FilterModal
                    isOpen={isFilterModalOpen}
                    onRequestClose={() => setFilterModalOpen(false)}
                    onApplyFilters={handleApplyFilters}
                />
                
                {students.length > 0 ? (
                    <table>
                        <thead>
                           <tr>
                                <th>Photo</th>
                                <th>Name</th>
                                <th>Roll</th>
                                <th>Session</th>
                                <th>Hall</th>
                                <th>Department</th>
                                {user.role === 'admin' && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student.rollNumber}>
                                    <td>
                                        <img src={student.profilePhotoUrl} alt={student.fullName} style={{width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover'}} />
                                    </td>
                                    <td>{student.fullName}</td>
                                    <td>{student.rollNumber}</td>
                                    <td>{student.session}</td>
                                    <td>{student.hall}</td>
                                    <td>{student.department}</td>
                                    {user.role === 'admin' && (
                                        <td>
                                            <button onClick={() => handleDelete(student.rollNumber, student.fullName)} className="btn btn-danger" style={{width: 'auto'}}>Delete</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : <p>No approved students found matching the current filters.</p>}
            </div>
        </div>
    );
};

export default TeacherDashboard;