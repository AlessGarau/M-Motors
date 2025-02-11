from rest_framework import viewsets, permissions
from app.entities.document.models import Document
from app.entities.document.serializer import DocumentSerializer
from rest_framework.parsers import MultiPartParser, FormParser

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticated]
