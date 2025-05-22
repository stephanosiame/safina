from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

# Import for location model
from django.conf import settings

# For user profile objects
from django.db.models.signals import post_save
from django.dispatch import receiver

class User(AbstractUser):
    """
    Extended User model with additional fields as shown in ERD
    """
    # Make email field unique
    email = models.EmailField(unique=True)
    phone_no = models.CharField(max_length=15, blank=True, null=True)
    ROLES = [
        ('student', 'Student'),
        ('staff', 'Staff'),
        ('visitor', 'Visitor'),
    ]
    # Default to empty list and mark as blank to make it optional
    roles = ArrayField(
        models.CharField(max_length=10, choices=ROLES), 
        default=list, 
        blank=True,
        help_text="Requires PostgreSQL. Use a comma-separated list of roles."
    )
    
    # Using string reference for location to avoid circular imports
    location_id = models.ForeignKey(
        'locations.Location', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='users'
    )
    
    def __str__(self):
        return self.username
    
    class Meta:
        db_table = 'auth_user'  # Use the same table as Django's default User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(max_length=500, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    
    def __str__(self):
        return f"{self.user.username}'s profile"

# Signal to create a user profile when a new user is created
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()