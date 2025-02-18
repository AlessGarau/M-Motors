import django_filters
from app.entities.contract.models import Contract

class ContractFilter(django_filters.FilterSet):
    service_type = django_filters.ChoiceFilter()
    admin = django_filters.BooleanFilter(method="filter_admin")

    class Meta:
        model = Contract
        fields = []

    def filter_admin(self, queryset, name, value):
        user = getattr(self.request, "user", None)

        if not user:
            return queryset.none()

        if hasattr(user, "profile") and user.profile.is_admin:
            if value:
                return Contract.objects.all()

        return queryset.filter(user=user)
