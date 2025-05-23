from rest_framework import serializers

from app.entities.document.models import Document

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'
