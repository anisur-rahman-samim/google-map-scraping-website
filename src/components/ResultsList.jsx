import React, { useState } from 'react';
import './ResultsList.css';

function ResultsList({ results }) {
  const [expandedId, setExpandedId] = useState(null);
  const [filterType, setFilterType] = useState('all');

  // Filter results based on type
  const filteredResults = results.filter((result) => {
    if (filterType === 'all') return true;
    if (filterType === 'with-phone') return result.phone !== null;
    if (filterType === 'with-website') return result.website !== null;
    return true;
  });

  const statsData = {
    total: results.length,
    withPhone: results.filter((r) => r.phone).length,
    withWebsite: results.filter((r) => r.website).length,
  };

  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="results-list">
      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            <span className="filter-count">{statsData.total}</span>
            All Results
          </button>
          <button
            className={`filter-btn ${filterType === 'with-phone' ? 'active' : ''}`}
            onClick={() => setFilterType('with-phone')}
          >
            <span className="filter-count">{statsData.withPhone}</span>
            <span className="filter-icon">📞</span>
            With Phone
          </button>
          <button
            className={`filter-btn ${filterType === 'with-website' ? 'active' : ''}`}
            onClick={() => setFilterType('with-website')}
          >
            <span className="filter-count">{statsData.withWebsite}</span>
            <span className="filter-icon">🌐</span>
            With Website
          </button>
        </div>
        <div className="results-info">
          Showing {filteredResults.length} of {results.length} results
        </div>
      </div>

      {/* Results Grid */}
      <div className="results-grid">
        {filteredResults.map((result, index) => (
          <ResultCard
            key={result.place_id || index}
            result={result}
            index={index}
            isExpanded={expandedId === result.place_id}
            onToggle={() => toggleExpanded(result.place_id)}
          />
        ))}
      </div>

      {/* Empty Filter State */}
      {filteredResults.length === 0 && results.length > 0 && (
        <div className="empty-filter">
          <p>No results match the selected filter</p>
        </div>
      )}
    </div>
  );
}

function ResultCard({ result, index, isExpanded, onToggle }) {
  const hasPhone = result.phone && result.phone.trim() !== '';
  const hasWebsite = result.website && result.website.trim() !== '';

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    console.log(`Copied ${type}: ${text}`);
  };

  return (
    <div className={`result-card ${isExpanded ? 'expanded' : ''}`}>
      {/* Card Header */}
      <div className="card-header" onClick={onToggle}>
        <div className="card-title-section">
          <h3 className="card-title">{result.name}</h3>
          <div className="result-badges">
            {hasPhone && <span className="badge phone-badge">📞</span>}
            {hasWebsite && <span className="badge website-badge">🌐</span>}
            {result.email && result.email !== 'N/A' && (
              <span className="badge email-badge">📧</span>
            )}
          </div>
        </div>
        <button className="expand-btn" aria-label="Toggle details">
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {/* Address */}
      <div className="card-address">
        <span className="address-icon">📍</span>
        <div className="address-content">
          <p className="address-text">{result.address}</p>
          <div className="coordinates">
            <code>{result.lat.toFixed(4)}, {result.lng.toFixed(4)}</code>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="card-expanded">
          {/* Phone */}
          {hasPhone && (
            <div className="info-row">
              <span className="info-label">📞 Phone</span>
              <div className="info-content">
                <a href={`tel:${result.phone}`} className="info-link">
                  {result.phone}
                </a>
                <button
                  className="copy-btn"
                  onClick={() => copyToClipboard(result.phone, 'phone')}
                  title="Copy to clipboard"
                >
                  📋
                </button>
              </div>
            </div>
          )}

          {/* Website */}
          {hasWebsite && (
            <div className="info-row">
              <span className="info-label">🌐 Website</span>
              <div className="info-content">
                <a
                  href={result.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="info-link"
                >
                  {result.website.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
                <button
                  className="copy-btn"
                  onClick={() => copyToClipboard(result.website, 'website')}
                  title="Copy to clipboard"
                >
                  📋
                </button>
              </div>
            </div>
          )}

          {/* Email */}
          {result.email && result.email !== 'N/A' && (
            <div className="info-row">
              <span className="info-label">📧 Email</span>
              <div className="info-content">
                <a
                  href={`mailto:${result.email}`}
                  className="info-link"
                >
                  {result.email}
                </a>
                <button
                  className="copy-btn"
                  onClick={() => copyToClipboard(result.email, 'email')}
                  title="Copy to clipboard"
                >
                  📋
                </button>
              </div>
            </div>
          )}

          {/* Place ID */}
          <div className="info-row">
            <span className="info-label">🔑 Place ID</span>
            <div className="info-content">
              <code className="place-id">{result.place_id}</code>
              <button
                className="copy-btn"
                onClick={() => copyToClipboard(result.place_id, 'place ID')}
                title="Copy to clipboard"
              >
                📋
              </button>
            </div>
          </div>

          {/* Google Maps Link */}
          <div className="card-actions">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${result.lat},${result.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="action-link"
            >
              View on Google Maps →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultsList;
