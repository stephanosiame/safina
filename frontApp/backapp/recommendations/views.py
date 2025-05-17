from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Recommendation
from .serializers import RecommendationSerializer
from locations.models import Location

class RecommendationViewSet(viewsets.ModelViewSet):
    queryset = Recommendation.objects.all()
    serializer_class = RecommendationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def for_location(self, request):
        """
        Get recommendations for a specific location
        """
        location_id = request.query_params.get('location_id')
        if not location_id:
            return Response({"error": "Location ID is required"}, status=400)
            
        try:
            location = Location.objects.get(location_id=location_id)
            recommendations = Recommendation.objects.filter(location=location)
            serializer = self.get_serializer(recommendations, many=True)
            return Response(serializer.data)
        except Location.DoesNotExist:
            return Response({"error": "Location not found"}, status=404)