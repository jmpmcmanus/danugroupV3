import json

from django.conf import settings
from django.shortcuts import render_to_response, redirect
from django.template import RequestContext
from django.http import HttpResponse, HttpResponseBadRequest
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout as auth_logout, login

from social.backends.oauth import BaseOAuth1, BaseOAuth2
from social.backends.google import GooglePlusAuth
from social.backends.utils import load_backends
from social.apps.django_app.utils import psa

from content.decorators import render_to

def main(request, template_name='content/index.html'):
    page_title = 'DanuGroup.org - Analysis of Environmental Issues, Technological Solutions, and Political Policies'
    return render_to_response(template_name, locals(), context_instance=RequestContext(request))

def mission(request, template_name="content/mission.html"):
    page_title = 'DanuGroup.org Mission'
    return render_to_response(template_name, locals(), context_instance=RequestContext(request))

def people(request, template_name="content/people.html"):
    page_title = 'People at DanuGroup.org'
    return render_to_response(template_name, locals(), context_instance=RequestContext(request))

def focus(request, template_name="content/focus.html"):
    page_title = 'Focus of DanuGroup.org'
    return render_to_response(template_name, locals(), context_instance=RequestContext(request))

def services(request, template_name="content/services.html"):
    page_title = 'Services Provided by DanuGroup.org'
    return render_to_response(template_name, locals(), context_instance=RequestContext(request))

def logout(request):
    """Logs out user"""
    auth_logout(request)
    return redirect('/')

def context(**extra):
    return dict({
        'plus_id': getattr(settings, 'SOCIAL_AUTH_GOOGLE_PLUS_KEY', None),
        'plus_scope': ' '.join(GooglePlusAuth.DEFAULT_SCOPE),
        'available_backends': load_backends(settings.AUTHENTICATION_BACKENDS)
    }, **extra)

@render_to('content/login.html')
def login(request):
    """Login view, displays login mechanism"""
    if request.user.is_authenticated():
        return redirect('done')
    return context()

@login_required
@render_to('content/login.html')
def done(request):
    """Login complete view, displays user data"""
    return context()

@render_to('content/login.html')
def validation_sent(request):
    return context(
        validation_sent=True,
        email=request.session.get('email_validation_address')
    )

@render_to('content/login.html')
def require_email(request):
    backend = request.session['partial_pipeline']['backend']
    return context(email_required=True, backend=backend)

