from rest_framework import serializers

from django.contrib.auth.models import User
from app.entities.user.models import Profile


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    is_admin = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "is_admin"]

    def create(self, validated_data):
        """Hash password before saving"""
        user = User.objects.create_user(**validated_data)
        user.is_active = True
        Profile.objects.create(user=user)
        user.save()
        return user

    def get_is_admin(self, obj):
        return obj.profile.is_admin if hasattr(obj, 'profile') else False
