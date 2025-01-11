from django import forms
from .models import Booking
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
import re

class UserRegistrationForm(UserCreationForm):
    """
    A form that uses the email as the username.
    """
    email = forms.EmailField(
        max_length=254,
        required=True,
        widget=forms.EmailInput(attrs={'placeholder': 'Enter your email'}),
    )
    full_name = forms.CharField(
        max_length=100,
        required=True,
        widget=forms.TextInput(attrs={'placeholder': 'Full Name'}),
    )

    class Meta:
        model = User
        fields = ['email', 'full_name', 'password1', 'password2']

    def clean_email(self):
        """
        Ensure the email is unique.
        """
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise ValidationError("This email address is already registered.")
        return email

    def save(self, commit=True):
        """
        Save the user with the email as the username and full name split into first/last name.
        """
        user = super().save(commit=False)
        user.username = self.cleaned_data['email']  # Use email as the username
        user.first_name, user.last_name = (
            self.cleaned_data['full_name'].split(' ', 1)
            if ' ' in self.cleaned_data['full_name']
            else (self.cleaned_data['full_name'], '')
        )
        if commit:
            user.save()
        return user


class UserInfoForm(forms.Form):
    """
    A form to collect additional information for bookings, such as phone number.
    """
    name = forms.CharField(
        max_length=100,
        required=True,
        widget=forms.TextInput(attrs={'placeholder': 'Full Name'}),
    )
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={'placeholder': 'Email Address'}),
    )
    phone = forms.CharField(
        max_length=20,
        required=False,
        widget=forms.TextInput(attrs={'placeholder': 'Phone Number'}),
    )

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)
        if user:
            self.fields['name'].initial = user.get_full_name()
            self.fields['email'].initial = user.email


class ChangeBookingForm(forms.Form):
    """
    A form to allow users to modify their existing booking details.
    """
    booking_start_time = forms.DateTimeField(
        widget=forms.DateTimeInput(attrs={'type': 'datetime-local'}),
        required=True,
    )
    number_of_guests = forms.IntegerField(
        min_value=1,
        required=True,
        widget=forms.NumberInput(attrs={'placeholder': 'Number of Guests'}),
    )