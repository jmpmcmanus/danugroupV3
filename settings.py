# Django settings for myblog project.
import os
PROJECT_ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.')

DEBUG = True

ADMINS = (
     ('Jim McManus', 'jim@danugroup.org'),
)

MANAGERS = ADMINS

if (os.getenv('SERVER_SOFTWARE', '').startswith('Google App Engine') or
    os.getenv('SETTINGS_MODE') == 'prod'):
    # Running on production App Engine, using a Google Cloud SQL database.
    DATABASES = {
        'default': {
                    'ENGINE': 'django.db.backends.mysql',
                    'HOST': '/cloudsql/danugroup:danugroupsqldb',
                    'NAME': 'danugroupdb',
                    'USER': 'root',
        }
    }
    SITE_ID = 2
    SOCIAL_AUTH_FACEBOOK_KEY = "654382481340068"
    SOCIAL_AUTH_FACEBOOK_SECRET = "d52190a4f7b3cc81b9112d54a15fda95"
    SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = "170786112510-hcd393nuu1fis7h94j7jga93aamvf7oa.apps.googleusercontent.com"
    SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = "JcKueqx7LDvzJPxywzV6c6bO"
    SOCIAL_AUTH_TWITTER_KEY = 'tIonIb9oJjejV0lcZKweysP5q'
    SOCIAL_AUTH_TWITTER_SECRET = 'pdgWAgjBc46V28jsVDafhs7SJOCjRLCtAjuGgcjhdMziwkAIMD'
else:
    # Running in development, using a local MySQL database.
    DATABASES = {
        'default': {
                    'ENGINE': 'django.db.backends.mysql',
                    'HOST': 'localhost',
                    'NAME': 'danugroupdb',
                    'USER': 'root',
                    'PASSWORD': 'grandgent',
        }
    }
    SITE_ID = 3
    SOCIAL_AUTH_FACEBOOK_KEY = "654386384673011"
    SOCIAL_AUTH_FACEBOOK_SECRET = "1194995587c5e31155e0e1e14a95f310"
    SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = "170786112510-litmdvisn66n97ft3budg87i4h4tcdha.apps.googleusercontent.com"
    SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = "HcK5YyIV7hD5o6XXGTNko1xc"
    SOCIAL_AUTH_TWITTER_KEY = 'tIonIb9oJjejV0lcZKweysP5q'
    SOCIAL_AUTH_TWITTER_SECRET = 'pdgWAgjBc46V28jsVDafhs7SJOCjRLCtAjuGgcjhdMziwkAIMD'

# Hosts/domain names that are valid for this site; required if DEBUG is False
# See https://docs.djangoproject.com/en/1.5/ref/settings/#allowed-hosts
ALLOWED_HOSTS = [
    'www.danugroup.org',
    'danugroup.org',
    'locahost:8000',
    'localhost:8080'
]

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# In a Windows environment this must be set to your system time zone.
TIME_ZONE = 'America/New_York'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
USE_L10N = True

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = True

# Site meta-data settings
SITE_NAME = 'DanuGroup site'
SITE_DESCRIPTION = ''
SITE_COPYRIGHT = ''
LOGIN_REDIRECT_URL = '/'

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/var/www/example.com/media/"
MEDIA_ROOT = ''

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://example.com/media/", "http://media.example.com/"
MEDIA_URL = ''

# URL prefix for static files.
# Example: "http://example.com/static/", "http://static.example.com/"
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(PROJECT_ROOT, 'static')

# Additional locations of static files
#PROJECT_ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)))
#STATICFILES_DIRS = [
#    os.path.join(PROJECT_ROOT, 'static'),
#]

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'pipeline.finders.PipelineFinder',
    #'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

# Make this unique, and don't share it with anybody.
SECRET_KEY = 'qokfx2j$tngeqlk=_0az@o1c!f(og)vt&l5ut#z2$u$9&$p-1x'

# List of callables that know how to import templates from various sources.
TEMPLATES = [
    {
       'BACKEND': 'django.template.backends.django.DjangoTemplates',
       'DIRS': [
           os.path.join(os.path.dirname(__file__), 'templates')
       ],
       'APP_DIRS': True,
       'OPTIONS': {
            'debug': DEBUG,
            'context_processors': [
                'django.contrib.auth.context_processors.auth',
                'django.template.context_processors.debug',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.template.context_processors.tz',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.request',
                'zinnia.context_processors.version',
                'social.apps.django_app.context_processors.backends',
                'responsive.context_processors.device_info',
                'context_processors.google_analytics',
            ],
        },
    },
]

AUTHENTICATION_BACKENDS = (
    'social.backends.facebook.FacebookOAuth2',
    'social.backends.google.GoogleOAuth2',
    'social.backends.twitter.TwitterOAuth',
    'social.backends.yahoo.YahooOpenId',
    'django.contrib.auth.backends.ModelBackend',
)

SOCIAL_AUTH_USER_MODEL = 'content.CustomUser'

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'responsive.middleware.DeviceInfoMiddleware',
)

ROOT_URLCONF = 'urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'wsgi.application'

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.sitemaps',
    'robots',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django_xmlrpc',
    'social.apps.django_app.default',
    'django_comments',
    'auth_user',
    'contact',
    'content',
    'investigations',
    'tagging',
    'mptt',
    'zinnia',
    'news',
    'pipeline',
)

from zinnia.xmlrpc import ZINNIA_XMLRPC_METHODS
XMLRPC_METHODS = ZINNIA_XMLRPC_METHODS

PIPELINE_ENABLED = True
STATICFILES_STORAGE = 'pipeline.storage.PipelineCachedStorage'

PIPELINE_CSS_COMPRESSOR = 'pipeline.compressors.cssmin.CSSMinCompressor'
PIPELINE_CSSMIN_BINARY = 'cssmin'
PIPELINE_JS_COMPRESSOR = 'pipeline.compressors.slimit.SlimItCompressor'

PIPELINE = {
    'PIPELINE_ENABLED': True,
    'JAVASCRIPT': {
        'danujs': {
            'source_filenames': (
               'js/css_browser_selector.js',
               'js/jquery.cycle2.js',
               'js/facebook.js',
               'js/tweet.js',
            ),
        'output_filename': 'js/danu.js',
        }
    },
    'STYLESHEETS': {
        'danucss': {
            'source_filenames':(
               'css/reset.css',
               'css/dg-theme.css',
               'css/menu.css',
               'css/dg-style.css',
               'css/social.css',
               'css/news.css',
            ),
        'output_filename': 'css/danu.css',
        'variant': 'datauri',
        }
    }
}

AUTH_USER_MODEL = 'auth_user.User'

LOGIN_URL = '/login/'
LOGIN_REDIRECT_URL = '/done/'
URL_PATH = ''
SOCIAL_AUTH_STRATEGY = 'social.strategies.django_strategy.DjangoStrategy'
SOCIAL_AUTH_STORAGE = 'social.apps.django_app.default.models.DjangoStorage'
SOCIAL_AUTH_GOOGLE_OAUTH_SCOPE = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/userinfo.profile'
]
# SOCIAL_AUTH_EMAIL_FORM_URL = '/signup-email'
SOCIAL_AUTH_EMAIL_FORM_HTML = 'email_signup.html'
SOCIAL_AUTH_EMAIL_VALIDATION_FUNCTION = 'content.mail.send_validation'
SOCIAL_AUTH_EMAIL_VALIDATION_URL = '/email-sent/'
# SOCIAL_AUTH_USERNAME_FORM_URL = '/signup-username'
SOCIAL_AUTH_USERNAME_FORM_HTML = 'username_signup.html'

SOCIAL_AUTH_PIPELINE = (
    'social.pipeline.social_auth.social_details',
    'social.pipeline.social_auth.social_uid',
    'social.pipeline.social_auth.auth_allowed',
    'social.pipeline.social_auth.social_user',
    'social.pipeline.user.get_username',
    'content.pipeline.require_email',
    'social.pipeline.mail.mail_validation',
    'social.pipeline.user.create_user',
    'social.pipeline.social_auth.associate_user',
    'social.pipeline.debug.debug',
    'social.pipeline.social_auth.load_extra_data',
    'social.pipeline.user.user_details',
    'social.pipeline.debug.debug'
)

TEST_RUNNER = 'django.test.runner.DiscoverRunner'

SESSION_SERIALIZER = 'django.contrib.sessions.serializers.JSONSerializer'

