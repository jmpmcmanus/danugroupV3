# Define a custom User class to work with django-social-auth
from django.db import models
from django.contrib.auth.models import AbstractUser
#from django.contrib import admin

class CustomUser(AbstractUser):
    pass

