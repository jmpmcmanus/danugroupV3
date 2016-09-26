from django.conf.urls import url
from contact.views import *

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
  url(r'^$', index, {'template_name':'contact/index.html'},'contact_index'),
  url(r'^thankyou.html$', show_thankyou, {'template_name': 'contact/thankyou.html'}, 'contact_thankyou')
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

