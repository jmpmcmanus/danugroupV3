from django.contrib.sitemaps import Sitemap
from django.core.urlresolvers import reverse

class ContentSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.5

    def items(self):
      return ['main', 'mission', 'people', 'focus']

    def location(self, item):
      return reverse(item)
