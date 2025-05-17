from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    UserViewSet, 
    UserProfileView, 
    CustomTokenObtainPairView,
    ProfileDetailView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    ChangePasswordView
)

router = DefaultRouter()
router.register('users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('profile/detail/', ProfileDetailView.as_view(), name='profile-detail'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('password/reset/request/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('password/reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('password/change/', ChangePasswordView.as_view(), name='password-change'),
]