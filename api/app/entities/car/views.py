from app.entities.car.models import Car
from app.entities.car.serializer import CarSerializer
from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class CarPagination(PageNumberPagination):
    page_size_query_param = 'page_size'
    max_page_size = 100


class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    pagination_class = CarPagination
