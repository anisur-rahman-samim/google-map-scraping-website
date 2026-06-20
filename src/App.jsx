import React, { useState, useRef } from 'react';
import SearchForm from './components/SearchForm';
import ResultsList from './components/ResultsList';
import ExportButton from './components/ExportButton';
import { LoadingSpinner, ErrorAlert, StatsCard } from './components/UtilityComponents';
import { GoogleSheetsExporter } from './utils/googleSheetsExporter';
import './App.css';

function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useState(null);
  const [stats, setStats] = useState(null);
  const resultsRef = useRef(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  const handleSearch = async (params) => {
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      setSearchQuery(params.query);
      setSearchParams(params);

      const response = await fetch(`${API_BASE_URL}/api/v1/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Search failed');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.message || 'An error occurred');
      }

      setResults(data.results || []);
      
      // Set statistics
      setStats({
        total: data.total,
        pages: data.pages || 1,
        cached: data.cached,
        timestamp: data.timestamp,
      });

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError(err.message || 'Failed to fetch results. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!results.length) {
      setError('No results to export');
      return;
    }

    try {
      const exporter = new GoogleSheetsExporter();
      await exporter.exportToGoogleSheets(
        results,
        searchQuery,
        searchParams
      );
      // Success message handled in export component
    } catch (err) {
      setError(`Export failed: ${err.message}`);
      console.error('Export error:', err);
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <h1>
              <span className="logo-icon">🗺️</span>
              Places Explorer
            </h1>
            <p className="subtitle">
              Find and export business data from Google Maps
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <div className="container">
          {/* Search Section */}
          <section className="search-section">
            <SearchForm onSearch={handleSearch} loading={loading} />
          </section>

          {/* Error Alert */}
          {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

          {/* Loading Spinner */}
          {loading && <LoadingSpinner message="Searching locations..." />}

          {/* Results Section */}
          {results.length > 0 && (
            <section className="results-section" ref={resultsRef}>
              {/* Statistics */}
              <div className="stats-container">
                <StatsCard 
                  icon="📊"
                  label="Total Results"
                  value={stats?.total || 0}
                />
                <StatsCard 
                  icon="📄"
                  label="Pages Fetched"
                  value={stats?.pages || 1}
                />
                <StatsCard 
                  icon="⚡"
                  label="Speed"
                  value={stats?.cached ? 'Cached' : 'Fresh'}
                />
              </div>

              {/* Export Button */}
              <div className="export-button-container">
                <ExportButton 
                  onClick={handleExport}
                  disabled={loading}
                  count={results.length}
                />
              </div>

              {/* Results List */}
              <ResultsList results={results} />

              {/* Export Button (Sticky) */}
              <div className="sticky-export">
                <ExportButton 
                  onClick={handleExport}
                  disabled={loading}
                  count={results.length}
                  variant="sticky"
                />
              </div>
            </section>
          )}

          {/* Empty State */}
          {!loading && results.length === 0 && searchQuery && (
            <section className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No results found</h3>
              <p>Try a different search query or location</p>
            </section>
          )}

          {/* Initial State */}
          {!loading && results.length === 0 && !searchQuery && (
            <section className="initial-state">
              <div className="initial-content">
                <h2>Start Exploring</h2>
                <p>Search for businesses, restaurants, services, or any location</p>
                <div className="feature-list">
                  <div className="feature">
                    <span className="feature-icon">✨</span>
                    <span>Find any business on Google Maps</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">📍</span>
                    <span>Location-based search with radius</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">📥</span>
                    <span>Export all results to Google Sheets</span>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="container">
          <p>Powered by Google Maps Places API</p>
          <p className="footer-note">
            Free to use for lead generation and business research
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
