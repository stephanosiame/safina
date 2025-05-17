from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from .models import NavigationRoute
from .serializers import NavigationRouteSerializer, RouteRequestSerializer
from locations.models import Location
import requests
import os

class NavigationRouteViewSet(viewsets.ModelViewSet):
    queryset = NavigationRoute.objects.all()
    serializer_class = NavigationRouteSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['post'])
    def calculate_route(self, request):
        """
        Calculate a route between two locations
        """
        serializer = RouteRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        source_id = serializer.validated_data['source_location_id']
        dest_id = serializer.validated_data['destination_location_id']
        
        try:
            source = Location.objects.get(location_id=source_id)
            destination = Location.objects.get(location_id=dest_id)
            
            # First check if we already have this route
            existing_route = NavigationRoute.objects.filter(
                source_location=source,
                destination_location=destination
            ).first()
            
            if existing_route:
                return Response(NavigationRouteSerializer(existing_route).data)
            
            # Calculate route using direct line distance (simplified)
            # In a real app, you would use a routing service like Google Maps API
            source_point = source.coordinate
            dest_point = destination.coordinate
            
            # Approximate direct distance in meters
            distance = source_point.distance(dest_point) * 100000
            
            # Estimate travel time (assuming average speed of 5 m/s)
            estimated_time = int(distance / 5)
            
            # Create and save the route
            route = NavigationRoute.objects.create(
                source_location=source,
                destination_location=destination,
                distance=distance,
                estimated_time=estimated_time
            )
            
            return Response(NavigationRouteSerializer(route).data)
            
        except Location.DoesNotExist:
            return Response({"error": "One or both locations not found"}, status=404)