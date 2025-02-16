from rest_framework import serializers
from django.core.files import File
import os
from app.entities.contract.models import Contract
from app.entities.contract.utils import generate_contract_pdf

import os
from django.core.files import File
from rest_framework import serializers
from app.entities.contract.models import Contract
from app.entities.contract.utils import generate_contract_pdf

class ContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = '__all__'

    def create(self, validated_data):
        contract = Contract.objects.create(**validated_data)
        pdf_path = generate_contract_pdf(contract)

        if not os.path.exists(pdf_path):
            return contract

        try:
            with open(pdf_path, "rb") as pdf_file:
                contract.pdf_file.save(f"contract_{contract.id}.pdf", File(pdf_file))
                contract.save()
        except Exception as e:
            print(f"{e}")

        os.remove(pdf_path)
        return contract
