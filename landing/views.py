from django.shortcuts import render
from django.views import generic
from .models import Restaurant, Table, Booking
# Create your views here.


class ShowRestaurants(generic.ListView):
    queryset = Restaurant.objects.all()
    template_name = "restaurant_list.html"