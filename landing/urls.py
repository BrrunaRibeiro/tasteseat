from .import views
from django.urls import path

urlpatterns = [
    path('', views.ShowRestaurants.as_view(), name='home'),
    path('restaurant/<int:restaurant_id>/',
          views.restaurant_detail, name='restaurant_detail'),
    path('booking-confirmation/<int:booking_id>/', views.booking_confirmation,
                name='booking_confirmation'),
]
