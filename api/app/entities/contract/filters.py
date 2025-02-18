import django_filters
from app.entities.contract.models import Contract

class ContractFilter(django_filters.FilterSet):
    service_type = django_filters.ChoiceFilter()
    all = django_filters.BooleanFilter(method="filter_all")

    class Meta:
        model = Contract
        fields = []
    
    def filter_all(self, queryset, name, value):
        user = getattr(self.request, "user", None)

        if user and hasattr(user, "profile") and user.profile.is_admin:
            if value:
                return Contract.objects.all()

        return queryset.filter(user=user)
