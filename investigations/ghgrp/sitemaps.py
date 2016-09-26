from django.contrib.sitemaps import Sitemap
from django.core.urlresolvers import reverse

class GHGRPSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.5

    def items(self):
      return ['ghgrp']

    def location(self, item):
      return reverse(item)
