from django.db import models
from app.entities.car.models import Car
from django.contrib.auth.models import User

def contract_pdf_path(instance, filename):
    """Génère un chemin correct pour les fichiers PDF dans MinIO."""
    return f"contract_{instance.id}_{filename}"  # ✅ Évite le double "contracts

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
    pdf_file = models.FileField(upload_to=contract_pdf_path, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Contrat {self.id} - {self.user.username}"