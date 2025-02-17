from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from app.entities.car.models import Car
from app.entities.car.serializer import CarSerializer
from app.entities.car.filters import CarFilter 
from rest_framework.pagination import PageNumberPagination

class CarPagination(PageNumberPagination):
    page_size_query_param = 'page_size'
    max_page_size = 100

class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    pagination_class = CarPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = CarFilter
