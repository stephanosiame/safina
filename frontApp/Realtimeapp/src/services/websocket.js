// src/services/websocket.js
class LocationTrackingService {
    constructor() {
      this.socket = null;
      this.socketUrl = null;
      this.callbacks = {
        onOpen: () => {},
        onMessage: () => {},
        onError: () => {},
        onClose: () => {},
        onGeofenceAlert: () => {}
      };
    }
  
    connect(userId) {
      // Get the base URL from the API endpoint (remove http/https and add ws/wss)
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      this.socketUrl = `${protocol}//localhost:8000/ws/location/${userId}/`;
      
      if (this.socket) {
        this.disconnect();
      }
  
      try {
        this.socket = new WebSocket(this.socketUrl);
        
        this.socket.onopen = (event) => {
          console.log('WebSocket connected');
          this.callbacks.onOpen(event);
        };
        
        this.socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          
          // Handle different message types
          if (data.type === 'geofence_alert') {
            this.callbacks.onGeofenceAlert(data);
          }
          
          this.callbacks.onMessage(data);
        };
        
        this.socket.onerror = (event) => {
          console.error('WebSocket error:', event);
          this.callbacks.onError(event);
        };
        
        this.socket.onclose = (event) => {
          console.log('WebSocket closed:', event);
          this.callbacks.onClose(event);
        };
        
        return true;
      } catch (error) {
        console.error('Error connecting to WebSocket:', error);
        return false;
      }
    }
    
    disconnect() {
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
    }
    
    sendLocation(lat, lng) {
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        console.error('WebSocket not connected');
        return false;
      }
      
      try {
        const message = JSON.stringify({
          type: 'location_update',
          lat,
          lng
        });
        
        this.socket.send(message);
        return true;
      } catch (error) {
        console.error('Error sending location:', error);
        return false;
      }
    }
    
    onOpen(callback) {
      this.callbacks.onOpen = callback;
    }
    
    onMessage(callback) {
      this.callbacks.onMessage = callback;
    }
    
    onError(callback) {
      this.callbacks.onError = callback;
    }
    
    onClose(callback) {
      this.callbacks.onClose = callback;
    }
    
    onGeofenceAlert(callback) {
      this.callbacks.onGeofenceAlert = callback;
    }
  }
  
  export default new LocationTrackingService();