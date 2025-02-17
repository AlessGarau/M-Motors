
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from app.entities.user.serializer import UserSerializer
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def login(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            response = Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email
                }
            })
            response.set_cookie(
                key='access_token',
                value=str(refresh.access_token),
                httponly=True,
                secure=True,  
                samesite='None', 
                max_age=86400
            )
            response.set_cookie(
                key='refresh_token',
                value=str(refresh),
                httponly=True,
                secure=True,  
                samesite='None',  
                max_age=7 * 86400
            )
            return response
        else:
            return Response({"error": "Login failed"}, status=status.HTTP_403_FORBIDDEN)

    @action(detail=False, methods=["get", "post"], permission_classes=[IsAuthenticated])
    def me(self, request):
        user = request.user

        if request.method == "POST":
            is_admin = request.data.get("isAdmin")
            if is_admin is not None:
                user.profile.is_admin = is_admin
                user.profile.save()

        serializer = self.get_serializer(instance=user)
        return Response({"user": serializer.data}, status=status.HTTP_200_OK)