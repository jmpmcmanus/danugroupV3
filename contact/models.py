from django.db import models
from django.contrib import admin

class Contact(models.Model):
	name = models.CharField(max_length=50)
	email = models.EmailField()
	date = models.DateTimeField(auto_now_add=True)
	message = models.TextField()
