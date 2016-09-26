from django.conf.urls import url
from investigations.views import *

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    url(r'^$', index, {'template_name':'investigations/index.html'}, name='index'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

