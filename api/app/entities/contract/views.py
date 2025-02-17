from rest_framework import viewsets, permissions, status
from django.core.files import File
from app.entities.contract.models import Contract
from rest_framework.decorators import action
from app.entities.contract.serializer import ContractSerializer
from app.entities.contract.utils import generate_contract_pdf
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
import os

class ContractViewSet(viewsets.ModelViewSet):
    serializer_class = ContractSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def all(self, request):
        user = request.user
        if user.profile.is_admin:
            contracts = Contract.objects.all()
            serializer = self.get_serializer(contracts, many=True)
            return Response({"all_contracts": serializer.data}, status=status.HTTP_200_OK)

        return Response({"error": "You are not an admin"}, status=403)
    
    def get_queryset(self):
        return Contract.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        contract = serializer.save(user=self.request.user)

        pdf_path = generate_contract_pdf(contract)

        if not os.path.exists(pdf_path):
            return

        with open(pdf_path, "rb") as pdf_file:
            contract.pdf_file.save(f"contract_{contract.id}.pdf", File(pdf_file))
            contract.save()

        os.remove(pdf_path)

