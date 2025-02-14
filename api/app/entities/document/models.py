from django.db import models

from app.entities.contract.models import Contract

class Document(models.Model):
    dossier = models.ForeignKey(Contract, related_name='documents', on_delete=models.CASCADE)
    file = models.FileField(upload_to='documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
