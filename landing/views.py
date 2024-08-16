
from django.views import generic
from django.utils.timezone import now
from datetime import datetime, timedelta
from django.shortcuts import render, redirect, get_object_or_404
from .forms import UserInfoForm
from .models import Restaurant, Table, Booking
# Create your views here.


class ShowRestaurants(generic.ListView):
    queryset = Restaurant.objects.all()
    template_name = "restaurant_list.html"


def restaurant_detail(request, restaurant_id):
    restaurant = get_object_or_404(Restaurant, pk=restaurant_id)

    default_date = now().date()
    selected_date = request.GET.get('date', default_date)
    guest_count = int(request.GET.get('guests', 2))

    today_str = (
        selected_date
        if isinstance(selected_date, str)
        else selected_date.strftime('%Y-%m-%d')
    )
    date_obj = datetime.strptime(today_str, "%Y-%m-%d").date()

    available_times = get_available_times(restaurant, guest_count, date_obj)

    form = UserInfoForm(user=request.user) if request.user.is_authenticated else UserInfoForm()

    return render(request, 'landing/restaurant_detail.html', {
        'restaurant': restaurant,
        'available_times': available_times,
        'selected_date': today_str,
        'guest_count': guest_count,
        'form': form,
    })


def get_available_times(restaurant, guest_count, date):
    # Standard time slots
    time_slots = ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
                    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30']

    available_times = {}
    for time in time_slots:
        slot_datetime = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M")

        # Check for table availability
        available_tables = Table.objects.filter(
            at_restaurant=restaurant,
            capacity__gte=guest_count
        ).exclude(
            booking__booking_start_time__lt=slot_datetime + timedelta(hours=2),
            booking__booking_end_time__gt=slot_datetime
        )

        available_times[time] = available_tables.exists()

        return available_times


def booking_confirmation(request, booking_id):
    booking = get_object_or_404(Booking, id=booking_id)
    return render(request, 'landing/booking_confirmation.html',
                   {'booking': booking})
