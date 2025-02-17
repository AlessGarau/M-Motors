import django_filters
from app.entities.car.models import Car


class CarFilter(django_filters.FilterSet):
    service_type = django_filters.ChoiceFilter(
        field_name="service_type", choices=Car.SERVICE_TYPE_CHOICES)

    class Meta:
        model = Car
        fields = ["service_type"]
