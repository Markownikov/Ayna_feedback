import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            ✨ Feedback Platform
          </Link>
          
          <nav className="nav-links">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="nav-link">
                  📊 Dashboard
                </Link>
                <Link to="/create-form" className="nav-link">
                  ➕ Create Form
                </Link>
                <span className="nav-link">👋 Welcome, {user.name}</span>
                <button 
                  onClick={handleLogout} 
                  className="btn btn-secondary"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  🔐 Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  🚀 Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
