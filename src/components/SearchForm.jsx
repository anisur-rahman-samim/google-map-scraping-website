import React, { useState } from 'react';
import './SearchForm.css';

function SearchForm({ onSearch, loading }) {
  const [query, setQuery] = useState('');
  const [useLocation, setUseLocation] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radius, setRadius] = useState('5000');
  const [formError, setFormError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    // Validation
    if (!query.trim()) {
      setFormError('Please enter a search query');
      return;
    }

    if (query.trim().length < 3) {
      setFormError('Search query must be at least 3 characters');
      return;
    }

    const params = {
      query: query.trim(),
    };

    if (useLocation) {
      if (!latitude || !longitude) {
        setFormError('Please enter latitude and longitude');
        return;
      }

      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);

      if (isNaN(lat) || isNaN(lng)) {
        setFormError('Invalid latitude or longitude');
        return;
      }

      if (lat < -90 || lat > 90) {
        setFormError('Latitude must be between -90 and 90');
        return;
      }

      if (lng < -180 || lng > 180) {
        setFormError('Longitude must be between -180 and 180');
        return;
      }

      params.location = { lat, lng };

      if (radius) {
        const rad = parseInt(radius);
        if (isNaN(rad) || rad < 1 || rad > 50000) {
          setFormError('Radius must be between 1 and 50000 meters');
          return;
        }
        params.radius = rad;
      }
    }

    onSearch(params);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toFixed(4));
          setLongitude(position.coords.longitude.toFixed(4));
          setUseLocation(true);
          setFormError('');
        },
        (error) => {
          setFormError('Unable to get your current location');
          console.error('Geolocation error:', error);
        }
      );
    } else {
      setFormError('Geolocation is not supported by your browser');
    }
  };

  const quickSearches = [
    { query: 'Restaurants', icon: '🍽️' },
    { query: 'Coffee Shops', icon: '☕' },
    { query: 'Hotels', icon: '🏨' },
    { query: 'Hospitals', icon: '🏥' },
    { query: 'Banks', icon: '🏦' },
    { query: 'Gyms', icon: '💪' },
  ];

  const handleQuickSearch = (query) => {
    setQuery(query);
    onSearch({ query });
  };

  return (
    <div className="search-form-container">
      <form onSubmit={handleSubmit} className="search-form">
        {/* Main Search Input */}
        <div className="search-input-group">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search for businesses, restaurants, services..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
              className="search-input"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="clear-button"
                disabled={loading}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            className={`search-button ${loading ? 'loading' : ''}`}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Searching...
              </>
            ) : (
              'Search'
            )}
          </button>
        </div>

        {/* Location Section */}
        <div className="location-section">
          <label className="location-toggle">
            <input
              type="checkbox"
              checked={useLocation}
              onChange={(e) => setUseLocation(e.target.checked)}
              disabled={loading}
            />
            <span className="toggle-label">Search by Location</span>
          </label>

          {useLocation && (
            <div className="location-inputs">
              <div className="location-input">
                <label htmlFor="latitude">Latitude</label>
                <input
                  id="latitude"
                  type="number"
                  step="0.0001"
                  min="-90"
                  max="90"
                  placeholder="e.g., 40.7128"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="location-input">
                <label htmlFor="longitude">Longitude</label>
                <input
                  id="longitude"
                  type="number"
                  step="0.0001"
                  min="-180"
                  max="180"
                  placeholder="e.g., -74.0060"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="location-input">
                <label htmlFor="radius">Radius (meters)</label>
                <input
                  id="radius"
                  type="number"
                  min="1"
                  max="50000"
                  placeholder="e.g., 5000"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  disabled={loading}
                />
              </div>

              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={loading}
                className="use-location-button"
              >
                📍 Current Location
              </button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {formError && (
          <div className="form-error">
            <span className="error-icon">⚠️</span>
            {formError}
          </div>
        )}
      </form>

      {/* Quick Searches */}
      <div className="quick-searches">
        <p className="quick-label">Popular Searches:</p>
        <div className="quick-buttons">
          {quickSearches.map((item) => (
            <button
              key={item.query}
              type="button"
              onClick={() => handleQuickSearch(item.query)}
              disabled={loading}
              className="quick-button"
              title={item.query}
            >
              <span className="quick-icon">{item.icon}</span>
              <span className="quick-text">{item.query}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchForm;
