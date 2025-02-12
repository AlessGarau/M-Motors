from rest_framework import serializers

from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]

    def create(self, validated_data):
        """Hash password before saving"""
        user = User.objects.create_user(**validated_data)
        user.is_active = True
        user.save()
        return user
    

