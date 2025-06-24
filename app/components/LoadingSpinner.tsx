import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="spinner-wrapper">
      <div className="spinner-base"></div>
      <div className="spinner-animation"></div>
    </div>
  );
};

export default LoadingSpinner;