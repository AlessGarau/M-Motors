from rest_framework.routers import DefaultRouter

from app.entities.example.views import ExampleViewSet
from app.entities.car.views import CarViewSet
from app.entities.user.views import UserViewSet
from app.entities.contract.views import ContractViewSet
from app.entities.document.views import DocumentViewSet
from app.entities.chat.views import ChatViewSet

router = DefaultRouter()
router.register(r'example', ExampleViewSet, basename='example')
router.register(r'car', CarViewSet, basename='car')
router.register(r'user', UserViewSet, basename='user')
router.register(r'contract', ContractViewSet, basename='contract')
router.register(r'document', DocumentViewSet, basename='document')
router.register(r'chat', ChatViewSet, basename='chat')

urlpatterns = router.urls