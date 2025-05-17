from django.contrib.gis.db import models

class Location(models.Model):
    """
    Location model to store location information with GeoDjango Point field
    """
    location_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=50)
    coordinate = models.PointField()
    
    def __str__(self):
        return self.name