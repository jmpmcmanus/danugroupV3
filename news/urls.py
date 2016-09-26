from django.conf.urls import include, url
from news.views import NewsSearch

urlpatterns = [
  url(r'^$', NewsSearch, name='danugroup_news_search'),
]

