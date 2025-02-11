from django.db import models

from app.entities.folder.models import Folder

class Document(models.Model):
    dossier = models.ForeignKey(Folder, related_name='documents', on_delete=models.CASCADE)
    file = models.FileField(upload_to='documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
