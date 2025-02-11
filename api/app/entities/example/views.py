
from app.entities.example.models import Example
from app.entities.example.serializer import ExampleSerializer
from rest_framework import viewsets
from rest_framework.response import Response

class ExampleViewSet(viewsets.ModelViewSet):
    queryset = Example.objects.all()
    serializer_class = ExampleSerializer
