import React from 'react';
import './UtilityComponents.css';

// Loading Spinner
export function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="loading-spinner-container">
      <div className="spinner"></div>
      <p>{message}</p>
      <p className="loading-subtext">This may take a few moments</p>
    </div>
  );
}

// Error Alert
export function ErrorAlert({ message, onClose }) {
  return (
    <div className="error-alert" role="alert">
      <div className="error-content">
        <span className="error-icon">⚠️</span>
        <div className="error-message-content">
          <h4>Something went wrong</h4>
          <p>{message}</p>
        </div>
      </div>
      <button
        className="error-close"
        onClick={onClose}
        aria-label="Close alert"
      >
        ✕
      </button>
    </div>
  );
}

// Stats Card
export function StatsCard({ icon, label, value }) {
  return (
    <div className="stats-card">
      <div className="stats-icon">{icon}</div>
      <div className="stats-content">
        <p className="stats-label">{label}</p>
        <p className="stats-value">{value}</p>
      </div>
    </div>
  );
}

export default { LoadingSpinner, ErrorAlert, StatsCard };
