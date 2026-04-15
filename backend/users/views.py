from rest_framework.response import Response
from rest_framework.decorators import api_view

# Create your views here.

@api_view(['POST'])
def login(request):
    return Response({"playlists": []})

@api_view(['POST'])
def logout(request):
    return Response({"playlists": []})

@api_view(['POST'])
def register(request):
    return Response({"playlists": []})

@api_view(['GET','POST','PATCH'])
def user_detail(request):
    return Response({"playlists": []})

@api_view(['POST'])
def password_reset(request):
    return Response({"playlists": []})