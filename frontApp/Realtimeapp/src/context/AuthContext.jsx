import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from local storage
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedRefreshToken = localStorage.getItem('refreshToken');
      
      if (storedToken) {
        try {
          // Get user profile information
          const userProfile = await authService.getProfile();
          setCurrentUser(userProfile);
        } catch (error) {
          // Token may be expired, try refreshing
          if (storedRefreshToken) {
            try {
              const data = await authService.refreshToken(storedRefreshToken);
              setToken(data.access);
              localStorage.setItem('token', data.access);
              
              // Try getting user profile again with new token
              const userProfile = await authService.getProfile();
              setCurrentUser(userProfile);
            } catch (refreshError) {
              // Refresh failed, clear auth state
              logout();
            }
          } else {
            // No refresh token, clear auth state
            logout();
          }
        }
      }
      
      setLoading(false);
    };
    
    initializeAuth();
  }, []);

  // Function to handle login
  const login = async (credentials) => {
    setError(null);
    try {
      const { email, password } = credentials;
      const data = await authService.login(email, password);
      
      // Save tokens to state and local storage
      setToken(data.access);
      setRefreshToken(data.refresh);
      localStorage.setItem('token', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      
      // Get user profile
      const userProfile = await authService.getProfile();
      setCurrentUser(userProfile);
      
      return true;
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to login. Please check your credentials.');
      return false;
    }
  };

  // Function to handle signup
  const signup = async (userData) => {
    setError(null);
    try {
      // Create new user account
      await authService.signup({
        full_name: userData.fullName,
        email: userData.email,
        password: userData.password
      });
      
      // Log in the new user
      return await login({
        email: userData.email,
        password: userData.password
      });
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to create an account. Please try again.');
      return false;
    }
  };

  // Function to handle logout
  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  };

  // Value to be provided to consumers
  const value = {
    currentUser,
    token,
    loading,
    error,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;