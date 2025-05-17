import React from 'react';
import '../../styles/common.css';

const InputField = ({ type, placeholder, value, onChange, icon }) => {
  return (
    <div className="input-field-container">
      {icon && (
        <span className="input-icon">
          {icon === 'user' && <i className="fas fa-user"></i>}
          {icon === 'lock' && <i className="fas fa-lock"></i>}
          {icon === 'envelope' && <i className="fas fa-envelope"></i>}
        </span>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="input-field"
      />
    </div>
  );
};

export default InputField;