from django.db import models

class SMSAlert(models.Model):
    """
    SMSAlert model for storing SMS alert information
    """
    alert_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='sms_alerts')
    message = models.TextField()
    time_stamp = models.DateTimeField(auto_now_add=True)
    is_sent = models.BooleanField(default=False)
    
    def __str__(self):
        return f"SMS Alert {self.alert_id} for {self.user.username}"