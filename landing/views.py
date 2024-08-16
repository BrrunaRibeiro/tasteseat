from django.shortcuts import render, redirect
from django.views import generic
from .models import Restaurant, Table, Booking
from django.shortcuts import get_object_or_404
from django.urls import reverse

# Create your views here.


class ShowRestaurants(generic.ListView):
    queryset = Restaurant.objects.all()
    template_name = "restaurant_list.html"
    

def restaurant_detail(request, restaurant_id):
    restaurant = get_object_or_404(Restaurant, id=restaurant_id)
    return render(request, 'landing/restaurant_detail.html', {'restaurant': restaurant})

