
from app.entities.car.models import Car
from app.entities.car.serializer import CarSerializer
from rest_framework import viewsets
from rest_framework.response import Response

class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
