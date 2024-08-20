    import json
    from datetime import datetime, timedelta
    from django.views import generic
    from django.views.decorators.http import require_POST
    from django.utils import timezone
    from django.shortcuts import render, redirect, get_object_or_404
    from .forms import UserInfoForm, ChangeBookingForm
    from .models import Restaurant, Table, Booking
    from django.contrib.auth.models import User
    from django.contrib.auth.decorators import login_required
    import pytz
    from django.http import JsonResponse
    from django.views.decorators.csrf import csrf_exempt


    class ShowRestaurants(generic.ListView):
        """
        Show a list of all restaurants.

        This view provides a way for users to view all available
        restaurants. It is crucial for users to have access to
        a comprehensive list of restaurants to make informed booking
        decisions. By presenting all options, it facilitates the
        user's journey in exploring dining choices.
        """
        queryset = Restaurant.objects.all()
        template_name = "restaurant_list.html"


    def restaurant_detail(request, restaurant_id):
        """
        Display details of a specific restaurant.

        This view is vital for allowing users to see detailed
        information about a restaurant, including its availability
        for bookings. The user can view available times based on
        their preferences (date and guest count), enabling a
        tailored experience for making reservations.
        """
        restaurant = get_object_or_404(Restaurant, pk=restaurant_id)
        default_date = timezone.localtime().date()
        selected_date = request.GET.get('date', default_date)
        guest_count = int(request.GET.get('guests', 2))

        if isinstance(selected_date, str):
            date_obj = datetime.strptime(selected_date, "%Y-%m-%d").date()
        else:
            date_obj = selected_date

        available_times = get_available_times(restaurant, guest_count, date_obj)

        form = (
            UserInfoForm(user=request.user)
            if request.user.is_authenticated
            else UserInfoForm()
        )

        return render(request, 'landing/restaurant_detail.html', {
            'restaurant': restaurant,
            'available_times': json.dumps(available_times),
            'selected_date': date_obj,
            'guest_count': guest_count,
            'form': form,
        })


    def get_available_times(restaurant, guest_count, date):
        """
        Determine available times for booking at a specific restaurant.

        This function is important for checking the availability of
        tables for the specified date and guest count. By optimizing
        the reservation process, it helps users find suitable times
        that fit their plans, enhancing user satisfaction and
        restaurant efficiency.
        """
        time_slots = ['12:00', '12:30', '13:00', '13:30', '14:00',
                    '14:30', '18:00', '18:30', '19:00', '19:30',
                    '20:00', '20:30']
        available_times = {}

        for time in time_slots:
            # Create a naive datetime object
            naive_slot_datetime = datetime.strptime(
                f"{date} {time}", "%Y-%m-%d %H:%M")
            slot_datetime_utc = timezone.make_aware(
                naive_slot_datetime, timezone.utc)

            # Check for availability using aware datetime
            available_tables = Table.objects.filter(
                at_restaurant=restaurant,
                capacity__gte=guest_count
            ).exclude(
                booking__booking_start_time__lt=slot_datetime_utc +
                timedelta(hours=2),
                booking__booking_end_time__gt=slot_datetime_utc
            )

            available_times[time] = available_tables.exists()

        return available_times


    @csrf_exempt
    def fetch_available_times(request):
        """
        Fetch available booking times for a restaurant via AJAX.

        This view allows users to dynamically retrieve available
        times for a restaurant based on their selections. This
        functionality enhances user experience by providing instant
        feedback without needing to reload the page, making the
        booking process smoother and more interactive.
        """
        if request.method == 'POST':
            try:
                data = json.loads(request.body)
                restaurant_id = data.get('restaurant_id')
                guest_count = data.get('guest_count')
                date = data.get('date')

                # Retrieve the restaurant object
                restaurant = get_object_or_404(Restaurant, pk=restaurant_id)

                # Call your existing function to get available times
                available_times = get_available_times(restaurant, guest_count,
                                                    date)

                return JsonResponse(available_times)

            except Exception as e:
                return JsonResponse({'error': str(e)}, status=400)

        return JsonResponse({'error': 'Invalid request'}, status=400)


    @require_POST
    def book_table(request):
        """
        Handle the booking of a table at a restaurant.

        This view processes the user's booking request, ensuring
        that only authenticated users can make reservations. By
        validating the user's input and checking for table
        availability, it ensures a reliable booking process,
        contributing to the overall quality and integrity of
        reservations managed by the application.
        """
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
                    naive_booking_time = datetime.strptime(
                        booking_time_start, '%H:%M')
                except ValueError:
                    form.add_error(None, 'Invalid time format. Please use HH:MM.')
                    return render(request, 'landing/restaurant_detail.html', {
                        'form': form})

                # Localize booking time
                today = timezone.localtime().date()
                complete_booking_time = datetime.combine(today,
                                                        naive_booking_time.time())
                booking_time_utc = timezone.make_aware(
                    complete_booking_time, timezone.utc)
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
                        # Optional fields like food_restrictions
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
            'form': form,  # Necessary context data for the template
        })


    def booking_confirmation(request, booking_id):
        """
        Confirm the details of a completed booking.

        This view is important for providing users with a
        confirmation of their booking details. It allows users
        to verify their reservation and contributes to a smooth
        user experience by clearly communicating booking
        outcomes.
        """
        booking = get_object_or_404(Booking, id=booking_id)
        return render(request, 'landing/booking_confirmation.html', {
            'booking': booking})


    def search_restaurants(request):
        """
        Search for restaurants based on user input.

        This view serves as a dynamic search feature, improving
        user experience by allowing users to filter restaurants
        according to their preferences in real time. This quick
        search capability helps users find suitable options
        without navigating through multiple pages.
        """
        # Check if the request is an AJAX request
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            if request.method == "GET":
                query = request.GET.get('q', '').strip()
                restaurants = Restaurant.objects.filter(name__icontains=query)
                restaurant_list = list(restaurants.values('id', 'name'))
                return JsonResponse(restaurant_list, safe=False)
        return JsonResponse([], safe=False, content_type='application/json')


    @login_required
    def my_bookings(request):
        """
        Display bookings made by the logged-in user.

        This view is crucial for enabling users to review their
        past and upcoming bookings. It enhances user retention by 
        providing easy access to booking information, thereby
        increasing user satisfaction and engagement with the
        application.
        """
        bookings = Booking.objects.filter(user_id=request.user)

        return render(request, 'landing/my_bookings.html', {'bookings': bookings})


    @login_required
    def cancel_booking(request, booking_id):
        """
        Cancel a user's existing booking.

        This view allows users to cancel their bookings as needed,
        providing flexibility and control over their dining plans.
        Managing bookings effectively contributes to user trust
        and enhances their overall experience with the service.
        """
        if request.method == "POST":
            booking = get_object_or_404(Booking, id=booking_id)
            booking.delete()  # Perform the deletion
            return JsonResponse({"message": "Booking cancelled successfully."})
        return JsonResponse({"error": "Invalid request."}, status=400)


    def change_booking(request, booking_id):
        """
        Change details of an existing booking.

        This view allows users to modify the details of their
        reservations, enhancing the flexibility of the booking
        system. Allowing changes helps accommodate users'
        changing plans and promotes a positive user experience.
        """
        booking = get_object_or_404(Booking, id=booking_id)

        if request.method == 'POST':
            form = ChangeBookingForm(request.POST)
            if form.is_valid():
                # Update the booking instance with new data
                booking.booking_start_time = form.cleaned_data[
                    'booking_start_time']
                booking.number_of_guests = form.cleaned_data['number_of_guests']
                booking.save()
                return redirect('booking_success', booking_id=booking.id)
        else:
            # Populate the form with current booking data
            form = ChangeBookingForm(initial={
                'booking_start_time': booking.booking_start_time,
                'number_of_guests': booking.number_of_guests,
            })

        return render(request, 'landing/change_booking.html', {
            'form': form, 'booking': booking})


    def booking_success(request, booking_id):
        """
        Show success message after a booking is made.

        This view is essential for confirming the user's booking
        was successful, enhancing the user experience by providing
        reassuring feedback and clear next steps in the process.
        """
        booking = get_object_or_404(Booking, id=booking_id)
        return render(request, 'landing/booking_success.html',
                    {'booking': booking})


    def custom_404_view(request, exception):
        """
        Display a custom 404 error page.

        This view handles situations when a user tries to access
        a resource that does not exist. Providing a user-friendly
        404 page helps maintain a positive user experience by
        guiding users back to relevant parts of the application
        instead of leaving them in confusion.
        """
        return render(request, 'landing/404.html', status=404)