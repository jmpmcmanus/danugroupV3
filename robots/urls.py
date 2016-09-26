try:
    from django.conf.urls import url
except ImportError:
    from django.conf.urls.defaults import url

from robots.views import *

urlpatterns = [
    url(r'^$', rules_list, name='robots_rule_list'),
]
