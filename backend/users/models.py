from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ADMIN = 'admin'
    MAINTAINER = 'maintainer'
    REPORTER = 'reporter'
    
    ROLE_CHOICES = [
        (ADMIN, 'Admin'),
        (MAINTAINER, 'Maintainer'),
        (REPORTER, 'Reporter'),
    ]
    
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=REPORTER)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return self.email
