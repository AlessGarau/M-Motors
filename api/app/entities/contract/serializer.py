from rest_framework import serializers
from app.entities.contract.models import Contract
from app.entities.car.models import Car

class ConctractSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="user.id")
    car = serializers.PrimaryKeyRelatedField(queryset=Car.objects.all())

    class Meta:
        model = Contract
        fields = "__all__"
