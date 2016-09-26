from django.contrib import admin
from .models import Feed

class FeedAdmin(admin.ModelAdmin):
    list_display = ('date_added', 'title', 'url')
    search_fields = ('date_added','title','url',)
    ordering = ('-date_added',)
try:
    admin.site.register(Feed, FeedAdmin)
except admin.sites.AlreadyRegistered:
    pass

