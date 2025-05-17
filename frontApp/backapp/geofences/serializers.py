from rest_framework import serializers
from .models import Geofence
from locations.serializers import LocationSerializer

class GeofenceSerializer(serializers.ModelSerializer):
    location_detail = LocationSerializer(source='location', read_only=True)
    
    class Meta:
        model = Geofence
        fields = ['geofence_id', 'location', 'location_detail', 'radius', 'trigger_type', 'action']
        read_only_fields = ['geofence_id']