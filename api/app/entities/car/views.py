from rest_framework import viewsets, filters, permissions
from django_filters.rest_framework import DjangoFilterBackend
from app.entities.car.models import Car
from app.entities.car.serializer import CarSerializer
from app.entities.car.filters import CarFilter 
from rest_framework.pagination import PageNumberPagination
from app.permissions.admin_permissions import IsAdminProfile

class CarPagination(PageNumberPagination):
    page_size_query_param = 'page_size'
    max_page_size = 100

class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    pagination_class = CarPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = CarFilter

    def get_permissions(self):
        if self.action in ['list', 'retrieve']: 
            return [permissions.AllowAny()]
        elif self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminProfile()] 
        return super().get_permissions()