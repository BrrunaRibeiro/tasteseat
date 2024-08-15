# Generated by Django 4.2.15 on 2024-08-15 11:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('landing', '0007_restaurant_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='restaurant',
            name='cuisine_type',
            field=models.IntegerField(choices=[(1, 'American'), (2, 'Japanese'), (3, 'Italian'), (4, 'Fast Food'), (5, 'Mexican'), (6, 'Indian'), (7, 'Pizza'), (8, 'Vegan'), (9, 'BBQ'), (10, 'Seafood'), (11, 'Steakhouse'), (12, 'Chinese'), (13, 'Mediterranean'), (14, 'Spanish'), (15, 'Asian Fusion'), (16, 'Grilled'), (17, 'French'), (18, 'Thai'), (19, 'Middle Eastern'), (20, 'European'), (21, 'Sizzling Platters'), (22, 'Garden Fresh'), (23, 'Tandoori'), (24, 'Ramen'), (25, 'Fusion'), (26, 'Brunch'), (27, 'Breakfast'), (28, 'Salad'), (29, 'Bistro'), (30, 'Wraps'), (31, 'Mexican Tacos'), (32, 'Asian'), (33, 'Burgers'), (34, 'Classic Pizza'), (35, 'Authentic Sushi'), (36, 'Spicy Curry'), (37, 'BBQ Delights'), (38, 'Fine Steakhouse'), (39, 'Chinese Dumplings'), (40, 'Gourmet Mediterranean'), (41, 'Spanish Tapas'), (42, 'Noodles'), (43, 'BBQ and Grill'), (44, 'Gourmet French'), (45, 'Exquisite Thai')], default=None),
        ),
    ]
