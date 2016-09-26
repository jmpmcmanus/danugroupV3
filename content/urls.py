from django.conf.urls import include, url
from content.views import *
import social.apps.django_app.urls

urlpatterns = [
  url(r'^$', main, {'template_name':'content/index.html'}, name='main'),
  url(r'^mission.html$', mission, {'template_name': 'content/mission.html'}, name='mission'),
  url(r'^people.html$', people, {'template_name': 'content/people.html'}, name='people'),
  url(r'^focus.html$', focus, {'template_name': 'content/focus.html'}, name='focus'),
  url(r'^services.html$', services, {'template_name': 'content/services.html'}, name='services'),
  url(r'^$', login),
  url(r'^login/$', login),
  url(r'^logout/$', logout),
  url(r'^done/$', done, name='done'),
  url(r'^email/$', require_email, name='require_email'),
  url(r'', include(social.apps.django_app.urls, namespace='social')),
]

