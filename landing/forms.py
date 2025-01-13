from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
from .models import UserProfile

class UserRegistrationForm(UserCreationForm):
    """
    A form that uses the email as the username and allows for full name and phone number.
    """
    email = forms.EmailField(max_length=254, required=True)
    full_name = forms.CharField(max_length=100, required=True)
    phone = forms.CharField(max_length=20, required=False)

    class Meta:
        model = User
        fields = ['email', 'full_name', 'phone', 'password1', 'password2']

    def save(self, commit=True):
        """
        Save the user with the email as the username and full name split into first/last name.
        Additionally, create or update the UserProfile.
        """
        # Create user from form data
        user = super().save(commit=False)
        user.username = self.cleaned_data['email']  # Use email as the username
        user.first_name, user.last_name = (
            self.cleaned_data['full_name'].split(' ', 1) if ' ' in self.cleaned_data['full_name']
            else (self.cleaned_data['full_name'], '')
        )
        
        if commit:
            user.save()

        # Check if UserProfile exists for the user, and create or update it
        profile, created = UserProfile.objects.get_or_create(user=user)
        profile.full_name = user.first_name + " " + user.last_name
        profile.phone_number = self.cleaned_data.get('phone')
        
        # Only save profile if it was created or updated
        if created or profile.phone_number != self.cleaned_data.get('phone'):
            profile.save()

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
        required=False,  # Make phone optional
        widget=forms.TextInput(attrs={'placeholder': 'Phone Number'}),
    )

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        phone = kwargs.pop('phone', None)  # Optionally get the phone number if passed

        super().__init__(*args, **kwargs)
        
        if user:
            self.fields['name'].initial = user.get_full_name()
            self.fields['email'].initial = user.email

        # If the phone number is passed, fill it in
        if phone:
            self.fields['phone'].initial = phone


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
