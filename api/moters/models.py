from django.db import models

class Example(models.Model):
    example = models.CharField(max_length=500)