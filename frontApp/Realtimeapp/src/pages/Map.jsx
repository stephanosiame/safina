import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import SearchBar from '../components/common/SearchBar';
import { locationService, navigationService } from '../services/api';
import LocationTrackingService from '../services/websocket';
import { useAuth } from '../context/AuthContext';
import '../styles/pages.css';

const Map = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { currentUser } = useAuth();

  // Get current location
  useEffect(() => {
    const getLocation = async () => {
      try {
        const position = await locationService.getCurrentLocation();
        setCurrentLocation(position);
      } catch (error) {
        console.error('Error getting location:', error);
        setError('Failed to get your current location. Please enable location services.');
        // Set a default location
        setCurrentLocation({
          lat: 40.712776,
          lng: -74.005974
        });
      }
    };

    getLocation();
  }, []);

  // Connect to WebSocket for real-time location tracking
  useEffect(() => {
    if (currentUser && currentLocation) {
      // Setup WebSocket connection
      const connected = LocationTrackingService.connect(currentUser.id);
      setIsConnected(connected);
      
      // WebSocket event handlers
      LocationTrackingService.onOpen(() => {
        setIsConnected(true);
        // Send initial location when connection opens
        LocationTrackingService.sendLocation(currentLocation.lat, currentLocation.lng);
      });
      
      LocationTrackingService.onClose(() => {
        setIsConnected(false);
      });
      
      LocationTrackingService.onGeofenceAlert((data) => {
        alert(`Geofence Alert: ${data.message}`);
      });
      
      // Cleanup on unmount
      return () => {
        LocationTrackingService.disconnect();
      };
    }
  }, [currentUser, currentLocation]);

  // Mock function for map initialization
  useEffect(() => {
    if (currentLocation) {
      // In a real app, we would initialize a map library like Google Maps or Mapbox here
      console.log('Initializing map with location:', currentLocation);
      
      // Simulate map loading
      setTimeout(() => {
        setMapLoaded(true);
      }, 1000);
    }
  }, [currentLocation]);

  // Function to track location changes
  const trackLocationChange = (newLocation) => {
    setCurrentLocation(newLocation);
    
    // Send updated location to WebSocket if connected
    if (isConnected) {
      LocationTrackingService.sendLocation(newLocation.lat, newLocation.lng);
    }
  };

  // Handle search for locations
  const handleSearch = async (searchTerm) => {
    setDestination(searchTerm);
    
    try {
      const results = await locationService.searchLocations(searchTerm);
      setSearchResults(results);
      
      if (results.length > 0) {
        // Select first result as destination
        const destination = {
          lat: results[0].latitude,
          lng: results[0].longitude
        };
        
        // Get directions to this destination
        const directionsData = await navigationService.calculateRoute(currentLocation, destination);
        console.log('Directions:', directionsData);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to search for this location. Please try again.');
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      
      <div className="main-content">
        <div className="map-container">
          {!mapLoaded ? (
            <div className="map-loading">Loading map...</div>
          ) : (
            <div className="map-placeholder">
              {/* In a real app, this would be the actual map component */}
              <div className="map-info">
                <p>Map View</p>
                <p>Current Location: {currentLocation?.lat.toFixed(4)}, {currentLocation?.lng.toFixed(4)}</p>
                {destination && <p>Destination: {destination}</p>}
                {isConnected && <p className="connected-status">Real-time tracking active</p>}
              </div>
            </div>
          )}
          
          <div className="navigation-controls">
            <div className="nav-arrows">
              <div className="nav-arrow up">↑</div>
              <div className="nav-arrow left">←</div>
              <div className="nav-arrow right">→</div>
              <div className="nav-arrow down">↓</div>
            </div>
          </div>
        </div>
        
        <div className="search-bar-container">
          <SearchBar onSearch={handleSearch} />
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default Map;