from django.contrib import admin
from .models import Contact

class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'date')
    search_fields = ('name', 'email',)
    ordering = ('-date',)
try:
    admin.site.register(Contact, ContactAdmin)
except admin.sites.AlreadyRegistered:
    pass

