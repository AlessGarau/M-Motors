from rest_framework import viewsets, permissions, status
from django_filters.rest_framework import DjangoFilterBackend
from django.core.files import File
from app.entities.contract.models import Contract
from app.entities.contract.serializer import ContractSerializer
from app.entities.contract.utils import generate_contract_pdf
from rest_framework.response import Response
from django.http import FileResponse
from app.entities.contract.filters import ContractFilter 
from rest_framework.decorators import action
import os

class ContractViewSet(viewsets.ModelViewSet):
    serializer_class = ContractSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = ContractFilter

    def get_permissions(self):
        if self.action == 'destroy':
            return [permissions.IsAuthenticated()]
        elif self.action == 'list':
            return [permissions.IsAuthenticated()]
        elif self.action == 'partial_update':
            return [permissions.IsAuthenticated()]
        elif self.action in ['retrieve', 'download_contract']:
            return [permissions.IsAuthenticated()]
        return super().get_permissions()

    def get_queryset(self):
            return Contract.objects.filter(user=self.request.user)

    def retrieve(self, request, pk=None):
        try:
            user = request.user
            is_admin = hasattr(user, "profile") and user.profile.is_admin
            show_admin = request.query_params.get("admin", "false").lower() == "true"

            if is_admin and show_admin:
                contract = Contract.objects.get(pk=pk)
            else:
                contract = Contract.objects.get(pk=pk, user=user)

            serializer = self.get_serializer(contract)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Contract.DoesNotExist:
            return Response({"error": "Contract not found"}, status=status.HTTP_404_NOT_FOUND)

    def perform_create(self, serializer):
        contract = serializer.save()
        pdf_path = generate_contract_pdf(contract)

        if not os.path.exists(pdf_path):
            return

        with open(pdf_path, "rb") as pdf_file:
            contract.pdf_file.save(f"contract_{contract.id}.pdf", File(pdf_file))
            contract.save()
        os.remove(pdf_path)

    def partial_update(self, request, pk=None):
        """Permet à un utilisateur de modifier son propre contrat, mais seul un admin peut modifier le statut"""
        try:
            contract = Contract.objects.get(pk=pk)

            if not request.user.profile.is_admin and contract.user != request.user:
                return Response({"error": "You do not have permission to modify this contract."},
                                status=status.HTTP_403_FORBIDDEN)
        except Contract.DoesNotExist:
            return Response({"error": "Contract not found"}, status=status.HTTP_404_NOT_FOUND)

        allowed_fields = ["start_date", "end_date"]
        if request.user.profile.is_admin:
            allowed_fields.append("status")

        update_data = {key: value for key, value in request.data.items() if key in allowed_fields}

        if "status" in request.data and not request.user.profile.is_admin:
            return Response({"error": "Only admins can modify the contract status."},
                            status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(contract, data=update_data, partial=True)

        if serializer.is_valid():
            serializer.save()

            if contract.pdf_file:
                contract.pdf_file.delete(save=False)
            pdf_path = generate_contract_pdf(contract)

            if os.path.exists(pdf_path):
                with open(pdf_path, "rb") as pdf_file:
                    contract.pdf_file.save(f"contract_{contract.id}.pdf", File(pdf_file))
                    contract.save()
                os.remove(pdf_path)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_destroy(self, instance):
        if instance.pdf_file:
            instance.pdf_file.delete()
        instance.delete()

    @action(detail=True, methods=["get"], url_path="download")
    def download_contract(self, request, pk=None):
        try:
            contract = Contract.objects.get(pk=pk)
            if not request.user.profile.is_admin and contract.user != request.user:
                return Response(
                    {"error": "You do not have permission to download this contract."},
                    status=status.HTTP_403_FORBIDDEN
                )
            if not contract.pdf_file or not contract.pdf_file.name:
                return Response(
                    {"error": "Contract PDF not found."},
                    status=status.HTTP_404_NOT_FOUND
                )
            response = FileResponse(contract.pdf_file, as_attachment=True, filename=f"contract_{contract.id}.pdf")
            return response
        except Contract.DoesNotExist:
            return Response({"error": "Contract not found"}, status=status.HTTP_404_NOT_FOUND)