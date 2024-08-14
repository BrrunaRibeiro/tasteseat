from django.db import models
from django.contrib.auth.models import User
from datetime import timedelta

CUISINES = (
    (1, 'Italian'),
    (2, 'Burgers'),
    (3, 'Mexican'),
    (4, 'Chinese'),
    (5, 'Indian'),
    (6, 'Thai'),
    (7, 'Japanese'),
    (8, 'German'),
    (9, 'French'),
    (10, 'Spanish'),
    (11, 'Russian'),
    (12, 'Vietnamese'),
    (13, 'Turkish'),
    (14, 'Indonesian'),
    (15, 'Brazilian'),
    (16, 'Egyptian'),
    (17, 'Greek'),
    (18, 'Korean'),
    (19, 'Polish'),
    (20, 'Czech'),
    (21, 'Sushi'),
)

RSV_STATUS = (
    ('pending', 'Pending'),
    ('confirmed', 'Confirmed'),
    ('completed', 'Completed'),
    ('cancelled', 'Cancelled')
)


# Create your models here.
class Restaurant(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    address = models.CharField(max_length=150)
    cuisine_type = models.IntegerField(choices=CUISINES, default=None)
    phone_number = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __srt__(self):
        return self.name


class Table(models.Model):
    table_number = models.CharField(primary_key=True, max_length=5)
    at_restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    capacity = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Table {self.table_number} at {self.at_restaurant.name}"


class Booking(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    table_id = models.ForeignKey(Table, on_delete=models.CASCADE)
    booking_start_time = models.DateTimeField()
    booking_end_time = models.DateTimeField(blank=True, null=True)
    number_of_guests = models.IntegerField()
    status = models.CharField(choices=RSV_STATUS,
                              max_length=20, default='pending')
    food_restrictions = models.CharField(max_length=200, blank=True, null=True)
    special_requests = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Bkg ID #{self.id}, Booked by {self.user_id}"

    def reset(self):
        self.booking_end_time = self.booking_start_time + timedelta(hours=2)
        