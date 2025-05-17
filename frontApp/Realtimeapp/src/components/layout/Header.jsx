import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../common/SearchBar';
import { useAuth } from '../../context/AuthContext';
import '../../styles/layout.css';

const Header = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (searchTerm) => {
    console.log('Searching for:', searchTerm);
    // Implement search functionality
  };

  return (
    <header className="header">
      <div className="header-content">
        <SearchBar onSearch={handleSearch} />
        
        <div className="header-actions">
          <div className="notification-icon">
            <i className="fas fa-bell"></i>
          </div>
          
          <div className="user-profile" onClick={() => navigate('/profile')}>
            <span className="profile-icon">
              {currentUser?.fullName?.charAt(0) || 'U'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;