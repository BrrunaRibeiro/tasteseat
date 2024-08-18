from . import views
from .views import restaurant_detail, book_table, booking_confirmation
from django.urls import path

urlpatterns = [
    path('restaurant_list', views.ShowRestaurants.as_view(), name='restaurant_list'),
    path('restaurant/<int:restaurant_id>/',
          views.restaurant_detail, name='restaurant_detail'),
    path('restaurant_details/', book_table, name='book_table'),
    path('booking-confirmation/<int:booking_id>/', views.booking_confirmation,
                name='booking_confirmation'),
]
