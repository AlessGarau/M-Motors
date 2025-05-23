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

    def perform_destroy(self, instance):
        if instance.pdf_file:
            instance.pdf_file.delete()
        instance.delete()

    def update(self, request, *args, **kwargs):
        restricted_fields = {"id", "created_at", "user", "pdf_file", "updated_date"}
        data = request.data.copy()

        instance = self.get_object()
        if instance.user != request.user:
            if request.user.profile.is_admin:
                allowed_fields = {"status"}
                invalid_fields = set(data.keys()) - allowed_fields
                if invalid_fields:
                    return Response({"error": f"Admins can only modify the status of other users' contracts. Invalid fields: {', '.join(invalid_fields)}"},status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"error": "You do not have permission to modify this contract."}, status=status.HTTP_403_FORBIDDEN)

        if "status" in data and not request.user.profile.is_admin:
            return Response({"error": "You cannot modify the status of this contract."},status=status.HTTP_400_BAD_REQUEST)

        invalid_fields = restricted_fields.intersection(data.keys())
        if invalid_fields:
            return Response({"error": f"You cannot modify these fields: {', '.join(invalid_fields)}"}, status=status.HTTP_400_BAD_REQUEST)

        response = super().update(request, *args, **kwargs)

        instance.refresh_from_db()
        new_pdf_path = generate_contract_pdf(instance)

        if not os.path.exists(new_pdf_path):
            return response

        if instance.pdf_file:
            instance.pdf_file.delete()

        with open(new_pdf_path, "rb") as pdf_file:
            instance.pdf_file.save(f"contract_{instance.id}.pdf", File(pdf_file))
            instance.save()
        os.remove(new_pdf_path)

        return response

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user
        data = request.data.copy()

        if not user.profile.is_admin:
            return Response(
                {"error": "You do not have permission to modify this contract."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if set(data.keys()) != {"status"}:
            return Response(
                {"error": "Only `status` can be modified using PATCH."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        data["status"] = data["status"].upper()

        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        signed_by_admin = user.username
        new_pdf_path = generate_contract_pdf(instance, signed_by_admin=signed_by_admin)

        if os.path.exists(new_pdf_path):
            if instance.pdf_file:
                instance.pdf_file.delete(save=False)

            with open(new_pdf_path, "rb") as pdf_file:
                instance.pdf_file.save(f"contract_{instance.id}.pdf", File(pdf_file))
                instance.save()
            os.remove(new_pdf_path)

        return Response(serializer.data, status=status.HTTP_200_OK)


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