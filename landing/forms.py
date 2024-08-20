from django import forms
from .models import Booking



class UserInfoForm(forms.Form):
    name = forms.CharField(max_length=100, required=True)
    email = forms.EmailField(required=True)
    phone = forms.CharField(max_length=20, required=False)

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)
        if user:
            self.fields['name'].initial = user.get_full_name()
            self.fields['email'].initial = user.email


class ChangeBookingForm(forms.Form):
    booking_start_time = forms.DateTimeField(
        widget=forms.DateTimeInput(attrs={'type': 'datetime-local'}),
        required=True,
    )
    number_of_guests = forms.IntegerField(
        min_value=1,
        required=True,
    )   