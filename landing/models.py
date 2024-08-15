from django.db import models
from django.contrib.auth.models import User
from datetime import timedelta

CUISINES = (
    (1, 'American'),
    (2, 'Japanese'),
    (3, 'Italian'),
    (4, 'Fast Food'),
    (5, 'Mexican'),
    (6, 'Indian'),
    (7, 'Pizza'),
    (8, 'Vegan'),
    (9, 'BBQ'),
    (10, 'Seafood'),
    (11, 'Steakhouse'),
    (12, 'Chinese'),
    (13, 'Mediterranean'),
    (14, 'Spanish'),
    (15, 'Asian Fusion'),
    (16, 'Grilled'),
    (17, 'French'),
    (18, 'Thai'),
    (19, 'Middle Eastern'),
    (20, 'European'),
    (21, 'Sizzling Platters'),
    (22, 'Garden Fresh'),
    (23, 'Tandoori'),
    (24, 'Ramen'),
    (25, 'Fusion'),
    (26, 'Brunch'),
    (27, 'Breakfast'),
    (28, 'Salad'),
    (29, 'Bistro'),
    (30, 'Wraps'),
    (31, 'Mexican Tacos'),
    (32, 'Asian'),
    (33, 'Burgers'),
    (34, 'Classic Pizza'),
    (35, 'Authentic Sushi'),
    (36, 'Spicy Curry'),
    (37, 'BBQ Delights'),
    (38, 'Fine Steakhouse'),
    (39, 'Chinese Dumplings'),
    (40, 'Gourmet Mediterranean'),
    (41, 'Spanish Tapas'),
    (42, 'Noodles'),
    (43, 'BBQ and Grill'),
    (44, 'Gourmet French'),
    (45, 'Exquisite Thai'),
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
    image = models.ImageField(upload_to='restaurant_images/')

    def __srt__(self):
        return f"Restaurant {self.name} at {self.address}"


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

