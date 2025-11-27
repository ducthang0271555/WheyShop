import React from 'react';
import '../styles/loading/LoadingSpinner.css';

const LoadingSpinner = () => {
    return (
        <div className="loading-spinner-overlay">
            <svg viewBox="25 25 50 50" className="containerLoader">
                <circle cx="50" cy="50" r="20" className="loader"></circle>
            </svg>
        </div>
    );
};

export default LoadingSpinner;
