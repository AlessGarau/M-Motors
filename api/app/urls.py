from rest_framework.routers import DefaultRouter

from app.entities.example.views import ExampleViewSet
from app.entities.car.views import CarViewSet
from app.entities.user.views import UserViewSet

router = DefaultRouter()
router.register(r'example', ExampleViewSet, basename='example')
router.register(r'car', CarViewSet, basename='car')
router.register(r'user', UserViewSet, basename='user')

urlpatterns = router.urls