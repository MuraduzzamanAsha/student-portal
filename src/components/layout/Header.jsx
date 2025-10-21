import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
console.log(user);
  return (
    <header className="header">
      <div className="header-logo">
        <Link to="/">MBSTU Portal</Link>
      </div>
      <nav className="header-nav">
        {user ? (
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <span>Welcome, <strong>{user.email}</strong> ({user.role})</span>
            <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
          </div>  
        ) : (
          <span>Welcome, Guest</span>
        )}
      </nav>
    </header>
  );
};

export default Header;