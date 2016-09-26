from django.conf.urls import include, url
from zinnia.sitemaps import ZinniaSitemap
from content.sitemaps import ContentSitemap
from investigations.ghgrp.sitemaps import GHGRPSitemap
from django.conf import settings
from django.contrib import admin

from django_xmlrpc.views import handle_xmlrpc
from django.contrib import sitemaps as csitemaps
import content.urls,investigations.urls,investigations.ghgrp.urls,zinnia.urls,contact.urls,news.urls
import django_comments.urls,social.apps.django_app.urls
import django.contrib.auth.urls,robots.urls

admin.autodiscover()

sitemaps = {
            'content': ContentSitemap(),
            'blog': ZinniaSitemap(),
            'investigations': GHGRPSitemap()
           }

urlpatterns = [
    url(r'^', include(content.urls)),
    url(r'^investigations/', include(investigations.urls)),
    url(r'^investigations/ghgrp/', include(investigations.ghgrp.urls)),
    url(r'^blog/', include(zinnia.urls, namespace='zinnia')),
    url(r'^blog/comments/', include(django_comments.urls)),
    url(r'^contact/', include(contact.urls)),
    url(r'^search/', include(news.urls)),
    url(r'^xmlrpc/$', handle_xmlrpc),
    url(r'^admin/', include(admin.site.urls)),
    url('', include(social.apps.django_app.urls, namespace='social')),
    url('', include(django.contrib.auth.urls, namespace='auth')),
    #url(r'^sitemap.xml$', 'django.contrib.sitemaps.views.sitemap', {'sitemaps': sitemaps}),
    url(r'^robots.txt', include(robots.urls)),
]

