from news.models import Feed
from django.template import Library

register = Library()

@register.inclusion_tag('news/latestnews.html', takes_context=True)
def show_latestnews(context, name='latestnews'):
    try:
        latestnews = Feed.objects.order_by('-date_added')[:19]
    except feed.DoesNotExist:
       raise http.Http404('LatestNews Work Not Found')
    except feed.MultipleObjectsReturned:
       raise http.Http404('Too Much News')

    return {'latestnews': latestnews}

