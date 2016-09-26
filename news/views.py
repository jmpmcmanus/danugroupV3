from news.search import generic_search, perform_search
from news.models import Feed
from django.shortcuts import render_to_response, redirect, get_object_or_404
from django.template import RequestContext
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

MODEL_MAP = {
    Feed: ["title"],
}

def NewsSearch(request, template_name='news/results.html'):
    """Search News"""
    objects = []
    pattern = request.GET['pattern']

    for model, fields in MODEL_MAP.items():
        objects += generic_search(request, model, fields, pattern)

    paginator = Paginator(objects, 20)
    page = request.GET.get('page')
    try:
      search_results = paginator.page(page)
    except PageNotAnInteger:
      # If page is not an integer, deliver first page.
      search_results = paginator.page(1)
    except EmptyPage:
      # If page is out of range (e.g. 9999), deliver last page of results.
      search_results = paginator.page(paginator.num_pages)

    return render_to_response(template_name,{"search_results":search_results,"pattern":pattern},
                              context_instance=RequestContext(request))

