from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from app.entities.contract.models import Contract
from app.entities.contract.serializer import ContractSerializer

class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        print(f"Utilisateur connecté : {user}")
        return Contract.objects.filter(user=user)

    def perform_create(self, serializer):
        print("perform_create() appelée !")
        print("Utilisateur authentifié :", self.request.user)
        print("Type utilisateur :", type(self.request.user))

        if self.request.user.is_anonymous:
            raise PermissionDenied("Utilisateur non authentifié !")

        serializer.save(user=self.request.user)
