from rest_framework import viewsets, permissions
from app.entities.folder.models import Folder
from app.entities.folder.serializer import FolderSerializer

class FoderViewSet(viewsets.ModelViewSet):
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user.user)