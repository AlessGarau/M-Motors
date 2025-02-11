from rest_framework.routers import DefaultRouter
from .views.example_viewset import ExampleViewSet

router = DefaultRouter()
router.register(r'example', ExampleViewSet, basename='example')

urlpatterns = router.urls