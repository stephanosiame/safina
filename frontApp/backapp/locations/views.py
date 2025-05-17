from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from .models import Location
from .serializers import LocationSerializer, LocationGeoSerializer

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'geo_data':
            return LocationGeoSerializer
        return LocationSerializer
    
    @action(detail=False, methods=['get'])
    def geo_data(self, request):
        """
        Return locations in GeoJSON format
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def nearby(self, request):
        """
        Find locations near a given point
        """
        try:
            lat = float(request.query_params.get('lat', 0))
            lng = float(request.query_params.get('lng', 0))
            radius = float(request.query_params.get('radius', 1000))  # Default 1km
            
            user_location = Point(lng, lat, srid=4326)
            locations = Location.objects.filter(coordinate__distance_lte=(user_location, D(m=radius)))
            
            serializer = LocationSerializer(locations, many=True)
            return Response(serializer.data)
        except (ValueError, TypeError):
            return Response({"error": "Invalid coordinates or radius"}, status=400)