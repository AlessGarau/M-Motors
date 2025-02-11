from app.models import Example
from rest_framework import serializers

class ExampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Example
        fields = ['example']