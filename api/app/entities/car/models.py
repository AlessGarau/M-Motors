from typing import Required
from django.db import models


class Car(models.Model):
    SERVICE_TYPE_CHOICES = {
        "SALE": "Vente",
        "RENTAL": "Location"
    }
    service_type = models.CharField(
        choices=SERVICE_TYPE_CHOICES,
        max_length=10,
        default="Vente"
    )
    brand = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.IntegerField()
    kilometers = models.BigIntegerField()
    price = models.IntegerField()
    image = models.ImageField(null=True, blank=True)
