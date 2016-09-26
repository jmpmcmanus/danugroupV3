# Define a custom User class to work with django-social-auth
from django.db import models
from django.contrib import admin

class Feed(models.Model):
    url = models.CharField(max_length=500, blank=True)
    title = models.CharField(max_length=500, blank=True)
    date_added = models.DateTimeField()

