from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from .models import Playlist
from games.models import Game
from .serializers import PlaylistSerializer, PlaylistUpdateSerializer
from games.serializers import GameDetailSerializer
from django.shortcuts import get_object_or_404


@api_view(["GET", "POST", "DELETE", "PUT"])
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

        query = Playlist.objects.filter(
            user=request.user
        ).prefetch_related("games")

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

    if request.method == "DELETE":

        ids = request.data.get("ids", [])

        playlists = Playlist.objects.filter(
            id__in=ids,
            user=request.user
        )

        if playlists.count() != len(ids):
            return Response(
                {"error": "Alguma playlist inválida"},
                status=400
            )

        playlists.delete()

        return Response(status=204)

    if request.method == "PUT":

        playlist_id = request.data.get("playlist_id")
        action = request.data.get("action")

        playlist = get_object_or_404(
            Playlist,
            id=playlist_id,
            user=request.user
        )
        
        if "title" in request.data or "description" in request.data:
            playlist.title = request.data.get("title", playlist.title)
            playlist.description = request.data.get("description", playlist.description)
            playlist.save()

            return Response(PlaylistSerializer(playlist).data)

        # 🔥 SENÃO → mexe nos jogos
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


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def playlist_detail(request, id):

    if request.method == "GET":

        playlist = Playlist.objects.prefetch_related("games").get(
            user=request.user, id=id
        )

        if not playlist:

            return Response({"status": "Playlist não encontrada"}, status=400)

        serializer = PlaylistSerializer(playlist)
        return Response(serializer.data, status=201)

    if request.method == "PUT":

        game_ids = request.data.get("games", [])

        games = Game.objects.filter(id__in=game_ids)

        playlist = Playlist.objects.get(user=request.user, id=id)

        if len(games) != len(game_ids):
            return Response({"error": "Jogos inválidos"}, status=400)

        serializer = PlaylistUpdateSerializer(playlist, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()

        return Response({"status": "Playlist atualizada com sucesso"}, status=200)

    if serializer.is_valid():
        serializer.save()

        return Response({"status": "Playlist criada com sucesso"}, status=200)
