from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SMSAlertViewSet

router = DefaultRouter()
router.register('sms', SMSAlertViewSet)

urlpatterns = [
    path('', include(router.urls)),
]