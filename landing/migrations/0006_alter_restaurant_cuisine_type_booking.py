# Generated by Django 4.2.15 on 2024-08-14 17:14

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('landing', '0005_table'),
    ]

    operations = [
        migrations.AlterField(
            model_name='restaurant',
            name='cuisine_type',
            field=models.IntegerField(choices=[(1, 'Italian'), (2, 'Burgers'), (3, 'Mexican'), (4, 'Chinese'), (5, 'Indian'), (6, 'Thai'), (7, 'Japanese'), (8, 'German'), (9, 'French'), (10, 'Spanish'), (11, 'Russian'), (12, 'Vietnamese'), (13, 'Turkish'), (14, 'Indonesian'), (15, 'Brazilian'), (16, 'Egyptian'), (17, 'Greek'), (18, 'Korean'), (19, 'Polish'), (20, 'Czech'), (21, 'Sushi')], default=None),
        ),
        migrations.CreateModel(
            name='Booking',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('booking_start_time', models.DateTimeField()),
                ('booking_end_time', models.DateTimeField(blank=True, null=True)),
                ('number_of_guests', models.IntegerField()),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('confirmed', 'Confirmed'), ('completed', 'Completed'), ('cancelled', 'Cancelled')], default='pending', max_length=20)),
                ('food_restrictions', models.CharField(blank=True, max_length=200, null=True)),
                ('special_requests', models.CharField(blank=True, max_length=200, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('table_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='landing.table')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
