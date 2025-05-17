import React, { useState, useEffect, useRef } from 'react';
import '../styles/map.css';

const MapView = ({ currentLocation, destination, onDirectionsChange }) => {
  const mapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [directions, setDirections] = useState(null);
  
  // This is a simplified mock of map functionality
  // In a real application, you would integrate with a mapping API like Google Maps or Mapbox
  
  useEffect(() => {
    if (currentLocation) {
      // Simulate map loading
      const timer = setTimeout(() => {
        setIsLoaded(true);
        console.log('Map initialized with location:', currentLocation);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [currentLocation]);
  
  useEffect(() => {
    if (isLoaded && destination && currentLocation) {
      // Simulate getting directions
      console.log(`Getting directions from ${JSON.stringify(currentLocation)} to ${destination}`);
      
      // Mock directions data - in real app would come from mapping API
      const mockDirections = {
        distance: '5.2 km',
        duration: '12 mins',
        steps: [
          { instruction: 'Head north on Current St', distance: '0.2 km' },
          { instruction: 'Turn right onto Main Ave', distance: '1.5 km' },
          { instruction: 'Turn left onto Destination Rd', distance: '3.5 km' }
        ]
      };
      
      setTimeout(() => {
        setDirections(mockDirections);
        if (onDirectionsChange) {
          onDirectionsChange(mockDirections);
        }
      }, 1500);
    }
  }, [isLoaded, destination, currentLocation, onDirectionsChange]);
  
  // Function to generate an SMS alert
  const sendSmsAlert = () => {
    // In a real app, this would call your backend API to send SMS
    console.log('Sending SMS alert with current location and ETA');
    alert('SMS Alert sent with your current location and ETA!');
  };
  
  if (!isLoaded) {
    return (
      <div className="map-loading-container">
        <div className="map-loading-spinner"></div>
        <p>Loading map...</p>
      </div>
    );
  }
  
  return (
    <div className="map-view">
      <div className="map-canvas" ref={mapRef}>
        {/* This would be replaced with actual map from API */}
        <div className="mock-map">
          <div className="map-center-marker">
            <i className="fas fa-map-marker-alt"></i>
          </div>
          
          {destination && (
            <div className="map-route-line"></div>
          )}
        </div>
      </div>
      
      {directions && (
        <div className="map-directions-panel">
          <div className="directions-header">
            <div className="directions-summary">
              <div className="directions-distance">{directions.distance}</div>
              <div className="directions-duration">{directions.duration}</div>
            </div>
            <button 
              className="sms-alert-button"
              onClick={sendSmsAlert}
            >
              <i className="fas fa-sms"></i> Send SMS Alert
            </button>
          </div>
          
          <div className="directions-steps">
            {directions.steps.map((step, index) => (
              <div key={index} className="direction-step">
                <div className="step-number">{index + 1}</div>
                <div className="step-details">
                  <div className="step-instruction">{step.instruction}</div>
                  <div className="step-distance">{step.distance}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;