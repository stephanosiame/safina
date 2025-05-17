import React from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import '../styles/pages.css';

const Auth = ({ isLogin = true }) => {
  return (
    <div className="auth-page">
      {isLogin ? <Login /> : <Signup />}
    </div>
  );
};

export default Auth;