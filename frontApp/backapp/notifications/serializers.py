from rest_framework import serializers
from .models import SMSAlert
from accounts.serializers import UserSerializer

class SMSAlertSerializer(serializers.ModelSerializer):
    user_detail = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = SMSAlert
        fields = ['alert_id', 'user', 'user_detail', 'message', 'time_stamp', 'is_sent']
        read_only_fields = ['alert_id', 'time_stamp', 'is_sent']