from django.forms import ModelForm, ValidationError
from contact.models import Contact

class ContactForm(ModelForm):
    def __init__(self, data=None, *args, **kwargs):
        if data=={}:
           data=None
        ModelForm.__init__(self, data, *args, **kwargs)
    class Meta:
        model=Contact
        fields='__all__'
        #Or a list of the fields that you want to include in your form
