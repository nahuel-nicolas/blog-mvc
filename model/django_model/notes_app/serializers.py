from .models import Note
from rest_framework import serializers


# class NoteSerializer(serializers.HyperlinkedModelSerializer):
class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = '__all__'