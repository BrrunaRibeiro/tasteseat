from django import forms
from .models import Booking

class BookingForm(forms.ModelForm):
    class Meta:
        model = Booking
        fields = ['table_id', 'booking_start_time', 'number_of_guests', 'food_restrictions', 'special_requests']

    def clean(self):
        cleaned_data = super().clean()
        start_time = cleaned_data.get("booking_start_time")
        