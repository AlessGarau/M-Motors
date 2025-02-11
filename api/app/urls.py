from rest_framework.routers import DefaultRouter

from app.entities.example.views import ExampleViewSet

router = DefaultRouter()
router.register(r'example', ExampleViewSet, basename='example')

urlpatterns = router.urls