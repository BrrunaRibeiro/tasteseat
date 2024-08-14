from django.db import models
from django.contrib.auth.models import User

CUISINES = (
    (1, 'Italian'),
    (2, 'American'),
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
