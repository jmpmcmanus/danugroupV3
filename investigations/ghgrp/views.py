from django.template import RequestContext
from django.shortcuts import render_to_response

def ghgrp(request, template_name="investigations/ghgrp/index.html"):
    page_title = "EPA's GreenHouse Gas Reporting Program"
    return render_to_response(template_name, locals(), context_instance=RequestContext(request))

def ghginvbar(request, template_name="investigations/ghgrp/ghginvbar.html"):
    page_title = 'US Greenhouse Gas Inventory'
    return render_to_response(template_name, locals(), context_instance=RequestContext(request))

def ghgsectorgasemissions(request, template_name="investigations/ghgrp/ghgsectorgasemissions.html"):
    page_title = 'Greenhouse Gases National Data'
    return render_to_response(template_name, locals(), context_instance=RequestContext(request))

def ghgsectorgas(request, template_name="investigations/ghgrp/ghgsectorgas.html"):
    page_title = 'Greenhouse Gases National Data'
    return render_to_response(template_name, locals(), context_instance=RequestContext(request))

def ghgmap(request, template_name="investigations/ghgrp/ghgmap.html"):
    page_title = 'US Greenhouse Gas Direct Emitters'
    return render_to_response(template_name, locals(), context_instance=RequestContext(request))

