from django.db import models

class Recommendation(models.Model):
    """
    Recommendation model for location recommendations
    """
    recommendation_id = models.AutoField(primary_key=True)
    location = models.ForeignKey('locations.Location', on_delete=models.CASCADE, related_name='origin_recommendations')
    recommended_location = models.ForeignKey('locations.Location', on_delete=models.CASCADE, related_name='recommendations')
    reason = models.TextField()
    
    def __str__(self):
        return f"Recommendation for {self.location.name}"