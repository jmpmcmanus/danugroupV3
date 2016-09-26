from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from contact.forms import ContactForm
from django.template import RequestContext

def index(request, template_name='content/index.html'):
    page_title = 'Contact DanuGroup.org'
    form=ContactForm(request.POST)
    if form.is_valid():
       form.save()
       return HttpResponseRedirect('/contact/thankyou.html')
    else:
       return render_to_response(template_name, {'form': ContactForm()}, context_instance=RequestContext(request))

def show_thankyou(request, template_name="contact/thankyou.html"):
    page_title = 'Contact DanuGroup.org'
    return render_to_response(template_name, locals(), context_instance=RequestContext(request))

