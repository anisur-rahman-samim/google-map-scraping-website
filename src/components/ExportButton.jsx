import React, { useState } from 'react';
import './ExportButton.css';

function ExportButton({ onClick, disabled, count, variant = 'default' }) {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleClick = async () => {
    setExporting(true);
    setError(null);
    setSuccess(false);

    try {
      await onClick();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Export failed');
      setTimeout(() => setError(null), 5000);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className={`export-button-wrapper ${variant}`}>
      <button
        onClick={handleClick}
        disabled={disabled || exporting}
        className={`export-button ${exporting ? 'loading' : ''} ${success ? 'success' : ''}`}
        title={`Export ${count} results to Google Sheets`}
      >
        {exporting ? (
          <>
            <span className="export-spinner"></span>
            Exporting...
          </>
        ) : success ? (
          <>
            <span className="export-icon">✓</span>
            Exported Successfully
          </>
        ) : (
          <>
            <span className="export-icon">📥</span>
            Export to Google Sheets
          </>
        )}
      </button>

      {count && !exporting && (
        <span className="export-count">
          {count} result{count !== 1 ? 's' : ''}
        </span>
      )}

      {error && (
        <div className="export-error">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {success && (
        <div className="export-success">
          <span className="success-icon">✓</span>
          Data exported to Google Sheets
        </div>
      )}
    </div>
  );
}

export default ExportButton;
