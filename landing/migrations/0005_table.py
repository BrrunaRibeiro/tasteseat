# Generated by Django 4.2.15 on 2024-08-14 14:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('landing', '0004_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Table',
            fields=[
                ('table_number', models.CharField(max_length=5, primary_key=True, serialize=False)),
                ('capacity', models.IntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('at_restaurant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='landing.restaurant')),
            ],
        ),
    ]
