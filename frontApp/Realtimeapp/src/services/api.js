// src/services/api.js
import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: 'http://localhost:8000/api',  // Update with your Django backend URL
});

// Add request interceptor for authentication
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth services
export const authService = {
  login: async (email, password) => {
    try {
      const response = await API.post('/accounts/token/', { email, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  signup: async (userData) => {
    try {
      const response = await API.post('/accounts/register/', userData);
      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },
  
  refreshToken: async (refreshToken) => {
    try {
      const response = await API.post('/accounts/token/refresh/', { refresh: refreshToken });
      return response.data;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  },
  
  forgotPassword: async (email) => {
    try {
      const response = await API.post('/accounts/password-reset/', { email });
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },
  
  getProfile: async () => {
    try {
      const response = await API.get('/accounts/profile/');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }
};

// Location services
export const locationService = {
  getCurrentLocation: () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          reject(error);
        }
      );
    });
  },
  
  searchLocations: async (query) => {
    try {
      const response = await API.get('/locations/search/', { params: { query } });
      return response.data;
    } catch (error) {
      console.error('Location search error:', error);
      throw error;
    }
  },
  
  getNearbyLocations: async (lat, lng, radius = 5000) => {
    try {
      const response = await API.get('/locations/nearby/', { 
        params: { lat, lng, radius } 
      });
      return response.data;
    } catch (error) {
      console.error('Nearby locations error:', error);
      throw error;
    }
  },
  
  getLocationDetails: async (locationId) => {
    try {
      const response = await API.get(`/locations/${locationId}/`);
      return response.data;
    } catch (error) {
      console.error('Get location details error:', error);
      throw error;
    }
  }
};

// Navigation services
export const navigationService = {
  calculateRoute: async (origin, destination) => {
    try {
      const response = await API.post('/navigation/calculate_route/', {
        origin_lat: origin.lat,
        origin_lng: origin.lng,
        destination_lat: destination.lat,
        destination_lng: destination.lng
      });
      return response.data;
    } catch (error) {
      console.error('Calculate route error:', error);
      throw error;
    }
  },
  
  getDirections: async (origin, destination) => {
    try {
      const response = await API.get('/navigation/directions/', {
        params: {
          origin_lat: origin.lat,
          origin_lng: origin.lng,
          destination_lat: destination.lat,
          destination_lng: destination.lng
        }
      });
      return response.data;
    } catch (error) {
      console.error('Get directions error:', error);
      throw error;
    }
  }
};

// Geofence services
export const geofenceService = {
  getGeofences: async () => {
    try {
      const response = await API.get('/geofences/');
      return response.data;
    } catch (error) {
      console.error('Get geofences error:', error);
      throw error;
    }
  },
  
  createGeofence: async (geofenceData) => {
    try {
      const response = await API.post('/geofences/', geofenceData);
      return response.data;
    } catch (error) {
      console.error('Create geofence error:', error);
      throw error;
    }
  },
  
  checkPosition: async (lat, lng) => {
    try {
      const response = await API.post('/geofences/check_position/', { lat, lng });
      return response.data;
    } catch (error) {
      console.error('Check position error:', error);
      throw error;
    }
  }
};

// Notification services
export const notificationService = {
  sendSMSAlert: async (data) => {
    try {
      const response = await API.post('/notifications/sms/', data);
      return response.data;
    } catch (error) {
      console.error('Send SMS alert error:', error);
      throw error;
    }
  },
  
  getUserAlerts: async () => {
    try {
      const response = await API.get('/notifications/sms/user_alerts/');
      return response.data;
    } catch (error) {
      console.error('Get user alerts error:', error);
      throw error;
    }
  },
  
  resendAlert: async (alertId) => {
    try {
      const response = await API.post(`/notifications/sms/${alertId}/resend/`);
      return response.data;
    } catch (error) {
      console.error('Resend alert error:', error);
      throw error;
    }
  }
};

// Recommendation services
export const recommendationService = {
  getRecommendations: async (lat, lng) => {
    try {
      const response = await API.get('/recommendations/for_location/', {
        params: { lat, lng }
      });
      return response.data;
    } catch (error) {
      console.error('Get recommendations error:', error);
      throw error;
    }
  }
};

export default {
  auth: authService,
  location: locationService,
  navigation: navigationService,
  geofence: geofenceService,
  notification: notificationService,
  recommendation: recommendationService
};