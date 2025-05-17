import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import InputField from '../common/InputField';
import Button from '../common/Button';
import '../../styles/auth.css';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call signup function from context with complete user data
      const success = await signup({ 
        fullName, 
        email, 
        password 
      });
      
      if (success) {
        navigate('/home');
      } else {
        setError('Failed to create an account. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during signup. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <i className="location-icon"></i>
          </div>
          <h2>Sign Up</h2>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <InputField 
            type="text"
            placeholder="Enter Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            icon="user"
          />
          
          <InputField 
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon="envelope"
          />
          
          <InputField 
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon="lock"
          />
          
          <InputField 
            type="password"
            placeholder="Re-write Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon="lock"
          />
          
          <Button 
            type="submit" 
            text={isLoading ? "Creating Account..." : "Sign Up"} 
            primary 
            fullWidth 
            disabled={isLoading}
          />
        </form>
        
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Log In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;