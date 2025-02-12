from rest_framework import serializers
from app.entities.folder.models import Folder
from app.entities.car.models import Car

class FolderSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="user.id")
    car = serializers.PrimaryKeyRelatedField(queryset=Car.objects.all())

    class Meta:
        model = Folder
        fields = "__all__"
 
    
