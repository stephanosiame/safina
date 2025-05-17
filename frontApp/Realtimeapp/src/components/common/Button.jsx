import React from 'react';
import '../../styles/common.css';

const Button = ({ type, text, onClick, primary, fullWidth }) => {
  const buttonClass = `button ${primary ? 'primary' : 'secondary'} ${fullWidth ? 'full-width' : ''}`;
  
  return (
    <button
      type={type || 'button'}
      onClick={onClick}
      className={buttonClass}
    >
      {text}
    </button>
  );
};

export default Button;