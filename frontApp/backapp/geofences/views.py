from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.gis.geos import Point
from .models import Geofence
from .serializers import GeofenceSerializer

class GeofenceViewSet(viewsets.ModelViewSet):
    queryset = Geofence.objects.all()
    serializer_class = GeofenceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['post'])
    def check_position(self, request):
        """
        Check if a given position is inside any geofence
        and return appropriate actions
        """
        try:
            lat = float(request.data.get('latitude', 0))
            lng = float(request.data.get('longitude', 0))
            
            user_location = Point(lng, lat, srid=4326)
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
                else:
                    # If user just exited a geofence
                    if geofence.trigger_type in ['exit', 'both']:
                        # You might need additional logic to track previous positions
                        # This is a simplified version
                        pass
            
            return Response({
                'triggered_geofences': triggered_geofences
            })
            
        except (ValueError, TypeError):
            return Response({"error": "Invalid coordinates"}, status=400)