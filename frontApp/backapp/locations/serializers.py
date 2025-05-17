from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from .models import Location

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['location_id', 'name', 'type', 'coordinate']

class LocationGeoSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Location
        geo_field = 'coordinate'
        fields = ['location_id', 'name', 'type']