import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
  if (size === 'sm') {
    return <div className="spinner-sm"></div>;
  }
  
  // The 'md' size is the new circle loader
  return (
    <div className="loader">
      <div className="circle circle-1"></div>
      <div className="circle circle-2"></div>
      <div className="circle circle-3"></div>
      <div className="circle circle-4"></div>
    </div>
  );
};

export default LoadingSpinner;