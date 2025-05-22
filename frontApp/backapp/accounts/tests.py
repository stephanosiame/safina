from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from rest_framework import status
import json

User = get_user_model()

class AuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.token_url = reverse('token_obtain_pair')
        
        # Create test users
        self.user1 = User.objects.create_user(
            username='testuser1',
            email='test@example.com',
            password='testpassword123'
        )
        
        # User with same email for testing the fixed serializer
        self.user2 = User.objects.create_user(
            username='testuser2',
            email='test@example.com',  # Same email as user1
            password='testpassword456'
        )
    
    def test_login_with_username(self):
        """Test login with username works correctly"""
        response = self.client.post(
            self.token_url,
            {'username_or_email': 'testuser1', 'password': 'testpassword123'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
    
    def test_login_with_email_first_user(self):
        """Test login with email works for the first user with that email"""
        response = self.client.post(
            self.token_url,
            {'username_or_email': 'test@example.com', 'password': 'testpassword123'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
    
    def test_login_with_email_second_user(self):
        """Test login with email works for the second user with that email"""
        response = self.client.post(
            self.token_url,
            {'username_or_email': 'test@example.com', 'password': 'testpassword456'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
    
    def test_login_with_wrong_password(self):
        """Test login fails with wrong password"""
        response = self.client.post(
            self.token_url,
            {'username_or_email': 'testuser1', 'password': 'wrongpassword'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_login_with_nonexistent_username(self):
        """Test login fails with nonexistent username"""
        response = self.client.post(
            self.token_url,
            {'username_or_email': 'nonexistentuser', 'password': 'testpassword123'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_login_with_nonexistent_email(self):
        """Test login fails with nonexistent email"""
        response = self.client.post(
            self.token_url,
            {'username_or_email': 'nonexistent@example.com', 'password': 'testpassword123'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)