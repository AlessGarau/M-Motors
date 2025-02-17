import os
from django.core.files import File
from rest_framework import serializers
from app.entities.contract.models import Contract
from app.entities.contract.utils import generate_contract_pdf

class ContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = '__all__'
        extra_kwargs = {'user': {'required': False}}

    def create(self, validated_data):
        request = self.context.get('request')

        if request and hasattr(request, "user"):
            validated_data['user'] = request.user

        contract = super().create(validated_data)
        pdf_path = generate_contract_pdf(contract)

        if not os.path.exists(pdf_path):
            return contract

        try:
            with open(pdf_path, "rb") as pdf_file:
                contract.pdffile.save(f"contract{contract.id}.pdf", File(pdf_file))
                contract.save()
        except Exception:
            pass

        os.remove(pdf_path)
        return contract