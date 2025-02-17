from typing import Required
from django.db import models

class Car(models.Model):
    BRAND_CHOICES = {
        "RENAULT": "Renault",
        "PEUGEOT": "Peugeot",
        "FIAT": "Fiat",
        "BMW": "BMW",
        "AUDI": "Audi",
        "NISSAN": "Nissan",
        "CITROEN": "Citroën",
    }
    SERVICE_TYPE_CHOICES = {
        "SALE": "Vente",
        "RENTAL": "Location"
    }
    brand = models.CharField(
        max_length=15,
        choices=BRAND_CHOICES,
    )
    service_type = models.CharField(
        choices=SERVICE_TYPE_CHOICES,
        max_length=10,
        default="Vente"
    )
    model = models.CharField(max_length=100)
    year = models.IntegerField()
    kilometers = models.BigIntegerField()
    price = models.IntegerField()
    image = models.ImageField(null=True, blank=True)
