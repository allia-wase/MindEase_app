import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="logo">
            <i className="fas fa-brain logo-icon"></i>
            <span>MindEase</span>
          </Link>

          <div className="nav-links">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Home
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/assessment" 
                  className={`nav-link ${location.pathname === '/assessment' ? 'active' : ''}`}
                >
                  Assessment
                </Link>
                <Link 
                  to="/resources" 
                  className={`nav-link ${location.pathname === '/resources' ? 'active' : ''}`}
                >
                  Resources
                </Link>
                <Link 
                  to="/crisis-support" 
                  className={`nav-link ${location.pathname === '/crisis-support' ? 'active' : ''}`}
                >
                  Crisis Support
                </Link>
                <Link 
                  to="/profile" 
                  className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
                >
                  Profile
                </Link>
              </>
            ) : (
              <Link 
                to="/" 
                className="nav-link"
              >
                Features
              </Link>
            )}
          </div>

          <div className="auth-buttons">
            {user ? (
              <button onClick={handleLogout} className="btn btn-outline">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
