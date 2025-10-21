import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { getSessions } from '../../api';
import { HALL_NAMES, DEPARTMENTS } from '../../utils/constants';

// --- Styling for the modal pop-up ---
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '500px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    padding: '2rem',
    border: 'none',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1000,
  },
};

// Binds the modal to your app element for accessibility
Modal.setAppElement('#root');

const FilterModal = ({ isOpen, onRequestClose, onApplyFilters }) => {
  const [sessions, setSessions] = useState([]);
  const [filters, setFilters] = useState({ session: '', hall: '', department: '' });

  // Fetch the list of academic sessions only when the modal is opened
  useEffect(() => {
    if (isOpen) {
      const fetchFilterOptions = async () => {
        try {
          const { data } = await getSessions();
          setSessions(data);
        } catch (error) {
          console.error(error.response?.data?.message || "Failed to fetch sessions for filter modal.");
        }
      };
      fetchFilterOptions();
    }
  }, [isOpen]); // The effect runs every time `isOpen` changes

  // Update the local state as the user changes dropdown values
  const handleChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Apply the selected filters and close the modal
  const handleFind = () => {
    onApplyFilters(filters);
    onRequestClose();
  };

  // Clear all filters and apply the empty set
  const handleClear = () => {
    const clearedFilters = { session: '', hall: '', department: '' };
    setFilters(clearedFilters);
    onApplyFilters(clearedFilters);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Filter Students"
    >
      <h2>Filter Students</h2>
      <div className="form-group">
        <label htmlFor="session-filter">Session</label>
        <select id="session-filter" name="session" value={filters.session} onChange={handleChange}>
          <option value="">Any Session</option>
          {sessions.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="hall-filter">Hall</label>
        <select id="hall-filter" name="hall" value={filters.hall} onChange={handleChange}>
          <option value="">Any Hall</option>
          {HALL_NAMES.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="department-filter">Department</label>
        <select id="department-filter" name="department" value={filters.department} onChange={handleChange}>
          <option value="">Any Department</option>
          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <button onClick={handleFind} className="btn" style={{ flex: 1 }}>
          Find
        </button>
        <button onClick={handleClear} className="btn btn-secondary" style={{ flex: 1 }}>
          Clear Filters & Find
        </button>
      </div>
    </Modal>
  );
};

export default FilterModal;