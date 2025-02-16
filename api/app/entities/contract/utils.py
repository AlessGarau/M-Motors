import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet

def generate_contract_pdf(contract):
    car = contract.car

    directory = "contracts/"
    if not os.path.exists(directory):
        os.makedirs(directory)

    file_path = os.path.join(directory, f"contract_{contract.id}.pdf")

    doc = SimpleDocTemplate(file_path, pagesize=A4)
    styles = getSampleStyleSheet()
    elements = []

    elements.append(Paragraph(f"<b>CONTRAT DE LOCATION / VENTE</b>", styles["Title"]))
    elements.append(Spacer(1, 12))

    details = [
        ["Contrat ID", f"{contract.id}"],
        ["Client", f"{contract.user.username}"],
        ["Type de contrat", f"{car.get_service_type_display()}"],
        ["Statut", f"{dict(contract.STATUS_CHOICES).get(contract.status, 'Non spécifié')}"],
        ["Date de début", f"{contract.start_date}"],
        ["Date de fin", f"{contract.end_date}"],
        ["Véhicule", f"{car.get_brand_display()} {car.model} - {car.year}"],
        ["Kilométrage", f"{car.kilometers} km"],
        ["Prix", f"{car.price} €"]
    ]

    table = Table(details, colWidths=[150, 300])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
        ('BACKGROUND', (0, 1), (-1, -1), colors.whitesmoke),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))
    elements.append(table)
    elements.append(Spacer(1, 20))

    elements.append(Paragraph("<b>Options incluses :</b>", styles["Heading2"]))
    options = []
    if contract.sav_included:
        options.append("✔ Service Après-Vente (SAV) inclus")
    if contract.assistance_included:
        options.append("✔ Assistance 24/7 incluse")
    if contract.purchase_option:
        options.append("✔ Option d'achat disponible")

    if options:
        for option in options:
            elements.append(Paragraph(option, styles["Normal"]))
    else:
        elements.append(Paragraph("Aucune option sélectionnée.", styles["Italic"]))

    elements.append(Spacer(1, 20))

    elements.append(Paragraph("<b>Clauses du contrat :</b>", styles["Heading2"]))
    clauses = [
        "1. Le client s'engage à respecter les conditions de location ou de vente spécifiées dans ce contrat.",
        "2. Tout retard de paiement entraînera des pénalités selon les termes définis.",
        "3. L'assurance du véhicule est obligatoire et à la charge du locataire.",
        "4. Le véhicule doit être restitué dans un état conforme à son état initial."
    ]

    for clause in clauses:
        elements.append(Paragraph(clause, styles["Normal"]))
    elements.append(Spacer(1, 20))

    elements.append(Paragraph("<b>Signature :</b>", styles["Heading2"]))
    elements.append(Spacer(1, 50))
    elements.append(Paragraph("Client : _________________________", styles["Normal"]))
    elements.append(Spacer(1, 10))
    elements.append(Paragraph("Représentant de l'entreprise : _________________________", styles["Normal"]))

    doc.build(elements)
    print(f"✅ PDF du contrat {contract.id} généré : {file_path}")
    sys.stdout.flush()

    return file_path
