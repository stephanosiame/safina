from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import SMSAlert
from .serializers import SMSAlertSerializer
from django.conf import settings
from twilio.rest import Client
import os

class SMSAlertViewSet(viewsets.ModelViewSet):
    queryset = SMSAlert.objects.all()
    serializer_class = SMSAlertSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        """
        When creating a new SMS alert, attempt to send it
        """
        alert = serializer.save(user=self.request.user)
        self.send_sms(alert)
    
    @action(detail=True, methods=['post'])
    def resend(self, request, pk=None):
        """
        Resend a failed SMS alert
        """
        alert = self.get_object()
        success = self.send_sms(alert)
        
        if success:
            return Response({"status": "SMS sent successfully"})
        return Response({"status": "Failed to send SMS"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def send_sms(self, alert):
        """
        Send SMS using Twilio
        """
        try:
            # Get Twilio credentials from settings
            account_sid = settings.SMS_API_KEY
            auth_token = settings.SMS_API_SECRET
            from_number = settings.SMS_FROM_NUMBER
            
            # Get user's phone number
            to_number = alert.user.phone_number
            
            if not to_number:
                return False
                
            # Initialize Twilio client
            client = Client(account_sid, auth_token)
            
            # Send message
            message = client.messages.create(
                body=alert.message,
                from_=from_number,
                to=to_number
            )
            
            # Update alert status
            alert.is_sent = True
            alert.save()
            
            return True
        except Exception as e:
            print(f"SMS sending failed: {str(e)}")
            return False
    
    @action(detail=False, methods=['get'])
    def user_alerts(self, request):
        """
        Get all alerts for the current user
        """
        alerts = SMSAlert.objects.filter(user=request.user).order_by('-time_stamp')
        serializer = self.get_serializer(alerts, many=True)
        return Response(serializer.data)