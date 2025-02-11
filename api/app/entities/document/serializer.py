from rest_framework import serializers

from app.entities.document.models import Document

class FolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'
