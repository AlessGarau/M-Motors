from django.db import models

# Create your models here.
class Example(models.Model):
    example = models.CharField(max_length=500)