import json
from datetime import datetime, timedelta
from django.views import generic
from django.views.decorators.http import require_POST
from django.utils import timezone
from django.shortcuts import render, redirect, get_object_or_404
from .forms import UserInfoForm
from .models import Restaurant, Table, Booking
from django.contrib.auth.models import User
import pytz
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


class ShowRestaurants(generic.ListView):
    queryset = Restaurant.objects.all()
    template_name = "restaurant_list.html"


def restaurant_detail(request, restaurant_id):
    restaurant = get_object_or_404(Restaurant, pk=restaurant_id)
    # Use timezone-aware 'now' to get default date
    default_date = timezone.localtime().date()
    selected_date = request.GET.get('date', default_date)
    guest_count = int(request.GET.get('guests', 2))

    # Always work with date objects and ensure they're timezone-aware
    if isinstance(selected_date, str):
        date_obj = datetime.strptime(selected_date, "%Y-%m-%d").date()
    else:
        date_obj = selected_date

    available_times = get_available_times(restaurant, guest_count, date_obj)

    form = UserInfoForm(user=request.user) if request.user.is_authenticated else UserInfoForm()

    return render(request, 'landing/restaurant_detail.html', {
        'restaurant': restaurant,
        'available_times': json.dumps(available_times),
        'selected_date': date_obj,
        'guest_count': guest_count,
        'form': form,
    })


def get_available_times(restaurant, guest_count, date):  
    time_slots = ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30',  
                  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30']  
    available_times = {}  

    for time in time_slots:
        # Create a naive datetime object
        naive_slot_datetime = datetime.strptime(
            f"{date} {time}", "%Y-%m-%d %H:%M")
        slot_datetime_utc = timezone.make_aware(naive_slot_datetime,  
                                             timezone.utc)  

        # Check for availability using aware datetime  
        available_tables = Table.objects.filter(  
            at_restaurant=restaurant,  
            capacity__gte=guest_count  
        ).exclude(  
            booking__booking_start_time__lt=slot_datetime_utc + timedelta(  
                hours=2),  
            booking__booking_end_time__gt=slot_datetime_utc  
        )

        available_times[time] = available_tables.exists()  

    return available_times  


@csrf_exempt  # Use with caution for CSRF, it's better to use the normal approach for production
def fetch_available_times(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            restaurant_id = data.get('restaurant_id')
            guest_count = data.get('guest_count')
            date = data.get('date')

            # Retrieve the restaurant object
            restaurant = get_object_or_404(Restaurant, pk=restaurant_id)

            # Call your existing function to get available times
            available_times = get_available_times(restaurant,
                                                    guest_count, date)

            return JsonResponse(available_times)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request'}, status=400)


@require_POST
def book_table(request):
    form = UserInfoForm(request.POST)
    booking_time_start = request.POST.get('booking_start_time')
    restaurant_id = request.POST.get('restaurant_id')
    guests = int(request.POST.get('guests', 2))
    try:
        timezone_offset = int(request.POST.get('timezone_offset', 0))
    except ValueError:
        timezone_offset = 0

    if form.is_valid():
        # Check if the user is authenticated, 
        # adjust this logic if non-authenticated can book
        if request.user.is_authenticated:
            # Extract user information
            name = form.cleaned_data['name']
            email = form.cleaned_data['email']
            phone = form.cleaned_data['phone']

            # Ensure booking_time is valid and parse it
            try:
                naive_booking_time = datetime.strptime(booking_time_start,
                                                            '%H:%M')
            except ValueError:
                form.add_error(None, 'Invalid time format. Please use HH:MM.')
                return render(request, 'landing/restaurant_detail.html',
                                {'form': form})

            # Localize booking time
            today = timezone.localtime().date()
            complete_booking_time = datetime.combine(today,
                                                        naive_booking_time.time())
            booking_time_utc = timezone.make_aware(complete_booking_time, timezone.utc)

            booking_end_time_utc = booking_time_utc + timedelta(hours=2)

            # Query for the restaurant and check for an available table
            restaurant = get_object_or_404(Restaurant, pk=restaurant_id)

            # Find an available table
            table = Table.objects.filter(
                at_restaurant=restaurant,
                capacity__gte=guests
            ).exclude(
                booking__booking_start_time__lt=booking_end_time_utc,
                booking__booking_end_time__gt=booking_time_utc
            ).first()

            if table:
                # Create a new booking
                booking = Booking.objects.create(
                    user_id=request.user,
                    table_id=table,
                    booking_start_time=booking_time_utc,
                    booking_end_time=booking_end_time_utc,
                    number_of_guests=guests,
                    # Optionally add any fields like food_restrictions or special_requests or simply keep it blank.  
                )
                return redirect('booking_confirmation', booking_id=booking.id)
            else:
                form.add_error(None,
                                "No tables available for the selected time.")
        else:
            form.add_error(None, "User is not authenticated.")
    else:
        print("Form errors:", form.errors)

    # If the form is invalid or no table is found, re-render the detail page
    return render(request, 'landing/restaurant_detail.html', {
        'form': form,
            # Include any necessary context data for the template
    })


def booking_confirmation(request, booking_id):
    booking = get_object_or_404(Booking, id=booking_id)
    return render(request, 'landing/booking_confirmation.html',
                    {'booking': booking})  


def search_restaurants(request):
    # Check if the request is an AJAX request
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        if request.method == "GET":
            query = request.GET.get('q', '').strip()
            restaurants = Restaurant.objects.filter(name__icontains=query)
            restaurant_list = list(restaurants.values('id', 'name'))
            return JsonResponse(restaurant_list, safe=False)
    return JsonResponse(restaurant_list, safe=False,
                        content_type='application/json')