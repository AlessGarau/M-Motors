from django.db import models
from app.entities.car.models import Car
from django.contrib.auth.models import User


class Contract(models.Model):
    STATUS_CHOICES = {
        "PENDING": "En attente",
        "APPROVE": "Validé",
        "REJECTED": 'Refusé'
    }

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    car = models.ForeignKey(Car, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    start_date = models.DateField()
    end_date = models.DateField()

    sav_included = models.BooleanField(default=False)
    assistance_included = models.BooleanField(default=False)
    purchase_option = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)