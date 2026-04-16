from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from .models import Game
from .serializer import GameSerializer

@api_view(['GET'])
def home(request):
    return Response({"playlists": []})

@api_view(['POST'])
def generate_playlist(request):
    return Response({"playlists": []})

@api_view(['POST', 'GET'])
def playlist(request):
    return Response({"playlists": []})

@api_view(['GET', 'PUT', 'DELETE'])
def playlist_detail(request):
    return Response({"playlists": []})


