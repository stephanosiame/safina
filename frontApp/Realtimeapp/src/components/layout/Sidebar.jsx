import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/layout.css';

const Sidebar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-profile">
        <div className="profile-circle">
          {/* This would be a user profile image in a real app */}
          <div className="profile-placeholder">
            {currentUser?.fullName?.charAt(0) || 'U'}
          </div>
        </div>
        <div className="profile-name">
          {currentUser?.fullName || 'User Name'}
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li onClick={() => navigate('/home')}>
            <i className="fas fa-home"></i>
            <span>Home</span>
          </li>
          <li onClick={() => navigate('/map')}>
            <i className="fas fa-map-marker-alt"></i>
            <span>Map</span>
          </li>
          <li onClick={() => navigate('/settings')}>
            <i className="fas fa-cog"></i>
            <span>Setting</span>
          </li>
          <li onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Log Out</span>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;