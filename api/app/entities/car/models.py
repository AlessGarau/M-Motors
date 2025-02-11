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
    TYPE_CHOICES = {
        "SALE": "Location",
        "RENTAL": "Vente"
    }
    brand = models.CharField(
        max_length=15,
        choices=BRAND_CHOICES,
        default=BRAND_CHOICES["RENAULT"]
    )
    model = models.CharField(max_length=100)
    year = models.IntegerField()
    kilometers = models.BigIntegerField()
    price = models.IntegerField()
    type = models.CharField(choices=TYPE_CHOICES, max_length=10)
    test = models.CharField(choices=TYPE_CHOICES, max_length=10)
    