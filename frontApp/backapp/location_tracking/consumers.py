import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.gis.geos import Point
from geofences.models import Geofence

class LocationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        
        # Only allow authenticated users
        if self.user.is_anonymous:
            await self.close()
            return
            
        self.room_name = f"user_{self.user.id}"
        self.room_group_name = f"location_{self.room_name}"
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
    
    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')
        
        if message_type == 'location_update':
            lat = data.get('latitude')
            lng = data.get('longitude')
            
            # Check geofences
            triggered_geofences = await self.check_geofences(lat, lng)
            
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'location_message',
                    'latitude': lat,
                    'longitude': lng,
                    'triggered_geofences': triggered_geofences
                }
            )
    
    async def location_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'latitude': event['latitude'],
            'longitude': event['longitude'],
            'triggered_geofences': event['triggered_geofences']
        }))
    
    @database_sync_to_async
    def check_geofences(self, lat, lng):
        user_location = Point(float(lng), float(lat), srid=4326)
        triggered_geofences = []
        
        # Check each geofence
        for geofence in Geofence.objects.all():
            distance = user_location.distance(geofence.location.coordinate) * 100000  # Approximate conversion to meters
            
            # If user is inside geofence radius
            if distance <= geofence.radius:
                if geofence.trigger_type in ['entry', 'both']:
                    triggered_geofences.append({
                        'geofence_id': geofence.geofence_id,
                        'location_name': geofence.location.name,
                        'actions': geofence.action,
                        'trigger_type': 'entry'
                    })
        
        return triggered_geofences