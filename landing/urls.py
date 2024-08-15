from .import views
from django.urls import path

urlpatterns = [
    path('', views.ShowRestaurants.as_view(), name='home'),
]
