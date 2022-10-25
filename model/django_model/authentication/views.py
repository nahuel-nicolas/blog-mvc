from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, mixins
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username
        # ...
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

def getObjectWithoutSpecificKeys(object, *keysToExclude):
    return {currentKey: object[currentKey] for currentKey in object if currentKey not in keysToExclude}

# class UserViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = []

    def list(self, request):
        queryset = User.objects.all()
        serializer = UserSerializer(queryset, many=True)
        list_of_objects = serializer.data
        object_of_objects = {}
        for currentObject in list_of_objects:
            current_object_id = currentObject["id"]
            object_of_objects[current_object_id] = getObjectWithoutSpecificKeys(currentObject, 'password')
        return Response(object_of_objects)

    def retrieve(self, request, pk=None):
        queryset = User.objects.all()
        user = get_object_or_404(queryset, pk=pk)
        serializer = UserSerializer(user)
        return Response(getObjectWithoutSpecificKeys(serializer.data, 'password'))

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/authentication/token',
        '/authentication/token/refresh',
        '/authentication/user',
    ]
    return Response(routes)
