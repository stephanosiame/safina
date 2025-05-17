from rest_framework import serializers
from .models import Recommendation
from locations.serializers import LocationSerializer

class RecommendationSerializer(serializers.ModelSerializer):
    location_detail = LocationSerializer(source='location', read_only=True)
    recommended_location_detail = LocationSerializer(source='recommended_location', read_only=True)
    
    class Meta:
        model = Recommendation
        fields = [
            'recommendation_id', 
            'location', 
            'recommended_location', 
            'location_detail', 
            'recommended_location_detail', 
            'reason'
        ]
        read_only_fields = ['recommendation_id']