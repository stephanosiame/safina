from rest_framework import serializers
from .models import NavigationRoute
from locations.serializers import LocationSerializer

class NavigationRouteSerializer(serializers.ModelSerializer):
    source_location_detail = LocationSerializer(source='source_location', read_only=True)
    destination_location_detail = LocationSerializer(source='destination_location', read_only=True)
    
    class Meta:
        model = NavigationRoute
        fields = [
            'route_id', 
            'source_location', 
            'destination_location', 
            'source_location_detail', 
            'destination_location_detail', 
            'distance', 
            'estimated_time'
        ]
        read_only_fields = ['route_id']

class RouteRequestSerializer(serializers.Serializer):
    source_location_id = serializers.IntegerField(required=True)
    destination_location_id = serializers.IntegerField(required=True)