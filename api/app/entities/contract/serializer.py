from rest_framework import serializers
from django.core.files import File
import os
from app.entities.contract.models import Contract
from app.entities.contract.utils import generate_contract_pdf

class ContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = '__all__'

    def create(self, validated_data):
        contract = Contract.objects.create(**validated_data)

        pdf_path = generate_contract_pdf(contract)

        if os.path.exists(pdf_path):
            print(f"📂 PDF détecté localement : {pdf_path}")
        else:
            print(f"❌ ERREUR : Le fichier PDF {pdf_path} n'a pas été généré !")
            return contract

        # 🔹 Enregistrer le PDF dans MinIO
        try:
            with open(pdf_path, "rb") as pdf_file:
                contract.pdf_file.save(f"contract_{contract.id}.pdf", File(pdf_file))
                contract.save()

            print(f"✅ PDF du contrat {contract.id} stocké sur MinIO : {contract.pdf_file.url}")

        except Exception as e:
            print(f"❌ ERREUR lors de l'upload sur MinIO : {e}")

        # 🔹 Supprimer le fichier temporaire local après l’upload
        os.remove(pdf_path)
        print(f"🗑️ Fichier local supprimé : {pdf_path}")

        return contract
