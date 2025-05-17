from django.contrib.gis.db import models
from django.contrib.postgres.fields import ArrayField

class Geofence(models.Model):
    """
    Geofence model for setting up geofenced areas
    """
    geofence_id = models.AutoField(primary_key=True)
    location = models.ForeignKey('locations.Location', on_delete=models.CASCADE, related_name='geofences')
    radius = models.FloatField()  # radius in meters
    TRIGGER_TYPES = [
        ('entry', 'Entry'),
        ('exit', 'Exit'),
        ('both', 'Both'),
    ]
    trigger_type = models.CharField(max_length=5, choices=TRIGGER_TYPES)
    ACTION_TYPES = [
        ('sent_alert', 'Send Alert'),
        ('recommended', 'Send Recommendation'),
    ]
    action = ArrayField(models.CharField(max_length=15, choices=ACTION_TYPES), default=list)
    
    def __str__(self):
        return f"Geofence {self.geofence_id} at {self.location.name}"