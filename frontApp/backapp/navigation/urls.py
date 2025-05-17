from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NavigationRouteViewSet

router = DefaultRouter()
router.register('', NavigationRouteViewSet)

urlpatterns = [
    path('', include(router.urls)),
]