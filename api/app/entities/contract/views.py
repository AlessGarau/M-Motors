from rest_framework import viewsets, permissions
from django.core.files import File
from app.entities.contract.models import Contract
from app.entities.contract.serializer import ContractSerializer
from app.entities.contract.utils import generate_contract_pdf
import os

class ContractViewSet(viewsets.ModelViewSet):
    serializer_class = ContractSerializer
    permission_classes = [permissions.IsAuthenticated]

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

