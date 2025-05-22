from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import UserProfile

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT token serializer that accepts either username or email
    """
    username_field = 'username_or_email'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields[self.username_field] = serializers.CharField()
        self.fields.pop('username', None)  # Remove the default username field

    def validate(self, attrs):
        # Get username or email
        identifier = attrs.get(self.username_field)
        password = attrs.get('password')
        
        if not identifier or not password:
            raise serializers.ValidationError('Both identifier and password are required')
            
        # Check if identifier is an email
        if '@' in identifier:
            try:
                user = User.objects.get(email=identifier)
            except User.DoesNotExist:
                raise serializers.ValidationError('No user found with this email')
        else:
            try:
                user = User.objects.get(username=identifier)
            except User.DoesNotExist:
                raise serializers.ValidationError('No user found with this username')
        
        # Rebuild the input for the parent class with the correct username
        attrs['username'] = user.username
        
        # Use modified attributes for parent validation
        return super(TokenObtainPairSerializer, self).validate(attrs)

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('bio', 'profile_picture')


class UserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True, required=True)
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'password2', 
                  'first_name', 'last_name', 'phone_no', 'roles', 'profile')
        extra_kwargs = {
            'password': {'write_only': True},
            'roles': {'required': False}
        }
    
    def validate(self, data):
        if data.get('password') != data.get('password2'):
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return data
    
    def create(self, validated_data):
        validated_data.pop('password2')
        
        # Extract roles and make sure it's a list
        roles = validated_data.pop('roles', [])
        if isinstance(roles, str):
            roles = [roles]
        
        # Create user without roles first
        user = User.objects.create_user(**validated_data)
        
        # Then set roles
        user.roles = roles
        user.save()
        
        return user

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            password = validated_data.pop('password')
            password2 = validated_data.pop('password2', None)
            instance.set_password(password)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    password2 = serializers.CharField(required=True, write_only=True)
    
    def validate(self, data):
        if data.get('password') != data.get('password2'):
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return data


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    new_password2 = serializers.CharField(required=True)
    
    def validate(self, data):
        if data.get('new_password') != data.get('new_password2'):
            raise serializers.ValidationError({"new_password": "Password fields didn't match."})
        return data