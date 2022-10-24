from .models import Note
from rest_framework import viewsets
from .serializers import NoteSerializer

"""
API endpoint that allows users to be viewed or edited.
"""
class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
