from .models import Post, Comment
from rest_framework import viewsets
from .serializers import PostSerializer, CommentSerializer

"""
API endpoint that allows users to be viewed or edited.
"""
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
