from . import views
from .views import (
    ShowRestaurants,
    restaurant_detail,
    book_table,
    booking_confirmation,
    search_restaurants,
    fetch_available_times,
    my_bookings,
    cancel_booking,
    change_booking,
    booking_success,
    custom_404_view,
)
from django.urls import path

urlpatterns = [
    path(
        'restaurant_list',
        views.ShowRestaurants.as_view(),
        name='restaurant_list'
    ),
    path(
        'restaurant/<int:restaurant_id>/',
        views.restaurant_detail,
        name='restaurant_detail'
    ),
    path(
        'restaurant_details/',
        book_table,
        name='book_table'
    ),
    path(
        'booking-confirmation/<int:booking_id>/',
        views.booking_confirmation,
        name='booking_confirmation'
    ),
    path(
        'search/',
        search_restaurants,
        name='search_restaurants'
    ),
    path(
        'fetch_available_times/',
        views.fetch_available_times,
        name='fetch_available_times'
    ),
    path(
        'my_bookings/',
        my_bookings,
        name='my_bookings'
    ),
    path(
        'cancel_booking/<int:booking_id>/',
        cancel_booking,
        name='cancel_booking'
    ),
    path(
        'change_booking/<int:booking_id>/',
        change_booking,
        name='change_booking'
    ),
    path(
        'booking_success/<int:booking_id>/',
        booking_success,
        name='booking_success'
    ),
]

handler404 = custom_404_view
