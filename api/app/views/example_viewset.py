
from app.models import Example
from app.serializer.example_serializer import ExampleSerializer
from rest_framework import viewsets
from rest_framework.response import Response

class ExampleViewSet(viewsets.ModelViewSet):
    queryset = Example.objects.all()
    serializer_class = ExampleSerializer
