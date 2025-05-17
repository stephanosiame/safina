import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import InputField from '../common/InputField';
import Button from '../common/Button';
import '../../styles/auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call login function from context with full credentials
      const success = await login({ email, password });
      if (success) {
        navigate('/home');
      } else {
        setError('Failed to login. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
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
          <h2>Log In</h2>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <InputField 
            type="text"
            placeholder="Enter Email / Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon="user"
          />
          
          <InputField 
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon="lock"
          />
          
          <div className="forgot-password">
            <Link to="/forgot-password">For get password</Link>
          </div>
          
          <Button 
            type="submit" 
            text={isLoading ? "Logging in..." : "Log In"} 
            primary 
            fullWidth 
            disabled={isLoading}
          />
        </form>
        
        <div className="auth-footer">
          <p>if you dont have accout please <Link to="/signup">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;