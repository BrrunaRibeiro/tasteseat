from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
from .models import UserProfile


class UserRegistrationForm(UserCreationForm):
    email = forms.EmailField(
        max_length=254,
        required=True,
        widget=forms.EmailInput(attrs={'placeholder': 'Enter your email'}), 
    )
    full_name = forms.CharField(
        max_length=100,
        required=True,  # Make it required
        widget=forms.TextInput(attrs={'placeholder': 'Full Name'}), 
    )
    phone_number = forms.CharField(  
        max_length=20,
        required=True,  # Make it required
        widget=forms.TextInput(attrs={'placeholder': 'Phone Number'}), 
    )

    class Meta:
        model = User
        fields = ['email', 'full_name', 'phone_number', 'password1', 'password2']

    def clean_email(self):
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

        # Create or update the user profile
        user_profile, created = UserProfile.objects.get_or_create(user=user)

        # Only update if profile exists, otherwise create new one
        if not created:  
            user_profile.phone_number = self.cleaned_data['phone_number']
            user_profile.full_name = self.cleaned_data['full_name']
            user_profile.save()

        return user, user_profile


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
    phone_number = forms.CharField(
        max_length=20,
        required=False,  # Make phone optional
        widget=forms.TextInput(attrs={'placeholder': 'Phone Number'}),
    )

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        phone_number = kwargs.pop('phone_number', None)  # Optionally get the phone number if passed

        super().__init__(*args, **kwargs)
        
        if user:
            self.fields['name'].initial = user.get_full_name()
            self.fields['email'].initial = user.email

        # If the phone number is passed, fill it in
        if phone_number:
            self.fields['phone_number'].initial = phone_number


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
