# Generated by Django 4.2.15 on 2024-08-14 14:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('landing', '0002_alter_client_username'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Client',
        ),
    ]
