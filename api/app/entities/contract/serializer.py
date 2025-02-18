import os
from django.core.files import File
from rest_framework import serializers
from app.entities.contract.models import Contract

class ContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = '__all__'
        extra_kwargs = {'user': {'required': False}}
    def create(self, validated_data):
        request = self.context.get('request')

        if request and hasattr(request, "user"):
            validated_data['user'] = request.user

        return super().create(validated_data)