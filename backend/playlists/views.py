from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination

from django.shortcuts import get_object_or_404

from .models import Playlist
from games.models import Game
from .serializers import PlaylistSerializer


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def playlist(request):

    if request.method == "GET":

        pk = request.query_params.get("id")

        if pk:
            playlist = get_object_or_404(
                Playlist.objects.prefetch_related("games"),
                id=pk,
                user=request.user
            )

            serializer = PlaylistSerializer(playlist)
            return Response(serializer.data, status=200)

        query = (
            Playlist.objects
            .filter(user=request.user)
            .prefetch_related("games")
            .order_by("-id")  
        )

        paginator = PageNumberPagination()
        paginator.page_size = 12

        result_page = paginator.paginate_queryset(query, request)

        serializer = PlaylistSerializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)

    if request.method == "POST":

        count = Playlist.objects.filter(user=request.user).count() + 1

        playlist = Playlist.objects.create(
            user=request.user,
            title=f"Minha playlist {count}",
            description=""
        )

        serializer = PlaylistSerializer(playlist)
        return Response(serializer.data, status=201)


@api_view(["GET", "DELETE", "PUT"])
@permission_classes([IsAuthenticated])
def playlist_detail(request, pk):

    playlist = get_object_or_404(
        Playlist.objects.prefetch_related("games"),
        id=pk,
        user=request.user
    )

    if request.method == "GET":
        serializer = PlaylistSerializer(playlist)
        return Response(serializer.data, status=200)


    if request.method == "DELETE":
        playlist.delete()
        return Response(status=204)

   
    if request.method == "PUT":

        action = request.data.get("action")

      
        if "title" in request.data or "description" in request.data:
            playlist.title = request.data.get("title", playlist.title)
            playlist.description = request.data.get("description", playlist.description)
            playlist.save()

            return Response(PlaylistSerializer(playlist).data)

        
        game_ids = request.data.get("game_ids", [])
        games = Game.objects.filter(id__in=game_ids)

        if action == "add":
            playlist.games.add(*games)

        elif action == "remove":
            playlist.games.remove(*games)

        elif action == "set":
            playlist.games.set(games)

        playlist.refresh_from_db()

        return Response(PlaylistSerializer(playlist).data)

    
    return Response(
        {"error": "Método não suportado ou requisição inválida"},
        status=400
    )