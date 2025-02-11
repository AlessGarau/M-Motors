from rest_framework import serializers

from app.entities.example.models import Example

class ExampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Example
        fields = ['example']