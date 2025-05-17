from django.contrib.gis.db import models
from django.contrib.postgres.fields import ArrayField

class NavigationRoute(models.Model):
    """
    NavigationRoute model for storing route information
    """
    route_id = models.AutoField(primary_key=True)
    source_location = models.ForeignKey('locations.Location', on_delete=models.CASCADE, related_name='source_routes')
    destination_location = models.ForeignKey('locations.Location', on_delete=models.CASCADE, related_name='destination_routes') 
    distance = models.FloatField()  # in meters
    estimated_time = models.IntegerField()  # in seconds
    
    def __str__(self):
        return f"Route from {self.source_location.name} to {self.destination_location.name}"