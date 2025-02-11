from django.db import models
from app.entities.car.models import Car

class Folder(models.Model):
    TYPE_CHOICES = {
        "SALE": "Location",
        "RENTAL": "Vente"
    }
    
    STATUS_CHOICES = {
        "PENDING": "En attente",
        "APPROVE": "Validé",
        "REJECTED": 'Refusé'
    }
    
    # client = models.ForeignKey(Client, on_delete=models.CASCADE)
    car = models.ForeignKey(Car, on_delete=models.CASCADE)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    start_date = models.DateField()
    end_date = models.DateField()
    
    sav_included = models.BooleanField(default=False)
    assistance_included = models.BooleanField(default=False)
    purchase_option = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)