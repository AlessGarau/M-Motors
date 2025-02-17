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
        if not user.profile.is_admin:
            return Response({"error": "You are not an admin"}, status=403)

        contracts = Contract.objects.all()
        serializer = self.get_serializer(contracts, many=True)
        return Response({"count": len(contracts), "all_contracts": serializer.data}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get", "patch", "delete"], url_path="all/(?P<id_contract>[^/.]+)", permission_classes=[IsAuthenticated])
    def get_contract(self, request, id_contract):
        user = request.user
        if not user.profile.is_admin:
            return Response({"error": "You are not an admin"}, status=status.HTTP_403_FORBIDDEN)

        try:
            contract = Contract.objects.get(id=id_contract)
            if request.method == "PATCH":
                contract_status = request.data.get("status").upper()
                if contract_status is not None:
                    if contract_status not in Contract.STATUS_CHOICES:
                        return Response(
                            {"error": f"Invalid status. Must be one of {list(Contract.STATUS_CHOICES.keys())}"},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    contract.status = contract_status
                    contract.save()
            elif request.method == "DELETE":
                contract.pdf_file.delete()
                contract.delete()
                return Response({"message": "Contract deleted"}, status=status.HTTP_200_OK)

            serializer = self.get_serializer(contract)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Contract.DoesNotExist:
            return Response({"error": "Contract not found"}, status=status.HTTP_404_NOT_FOUND)

    def get_queryset(self):
        return Contract.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        contract = serializer.save()

        pdf_path = generate_contract_pdf(contract)

        if not os.path.exists(pdf_path):
            return

        with open(pdf_path, "rb") as pdf_file:
            contract.pdf_file.save(f"contract_{contract.id}.pdf", File(pdf_file))
            contract.save()

        os.remove(pdf_path)
    
    def perform_update(self, serializer):
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
        return Response(status=status.HTTP_204_NO_CONTENT)

