from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from .models import Playlist
from games.models import Game
from .serializers import PlaylistSerializer, PlaylistUpdateSerializer
from games.serializers import GameDetailSerializer


@api_view(["GET"])
def home(request):
    return Response({"playlists": []})


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def playlist(request):

    if request.method == "GET":
        query = Playlist.objects.filter(user=request.user).prefetch_related("games")

        paginator = PageNumberPagination()
        paginator.page_size = 12

        result_page = paginator.paginate_queryset(query, request)

        serializer = PlaylistSerializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)

    if request.method == "POST":
        mode = request.data.get("mode", "manual")

        title = request.data.get("title", "Nova playlist")
        description = request.data.get("description", "")
        game_ids = request.data.get("games", [])

        games = Game.objects.all()

        if mode == "auto":

            tags = request.data.get("tags")
            min_rating = request.data.get("min_rating")
            min_value = request.data.get("min_value")
            min_review = request.data.get("min_review")

            if tags:
                games = games.filter(tags__name=tags)

            if min_value:
                games = games.filter(discount_price__gte=min_value)

            if min_review:
                games = games.filter(total_reviews__gte=min_review)

            if min_rating:
                games = games.filter(review_rating__gte=min_rating)

            games = games.order_by("-review_rating", "-total_reviews")[:5]

        else:

            if not isinstance(game_ids, list):
                return Response({"error": "games deve ser uma lista"}, status=400)

            games = Game.objects.filter(id__in=game_ids)

            if games.count() != len(set(game_ids)):
                return Response({"error": "Alguns games não existem"}, status=400)

        if not games.exists():
            return Response({"error": "Nenhum jogo encontrado"}, status=400)

        playlist = Playlist.objects.create(
            user=request.user, title=title, description=description
        )

        playlist.games.set(games)

        serializer = PlaylistSerializer(playlist)

        return Response(serializer.data, status=201)


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

    if request.method == "DELETE":

        title = request.data.get("title")

        games = Playlist.objects.filter(id__in=game_ids)

        if len(games) != len(game_ids):
            return Response({"error": "Playlist inválida"}, status=400)

        playlist = Playlist.objects.delete(
            title=title or "", description=description or ""
        )
        playlist.games.set(games)

        return Response({"status": "Playlist criada com sucesso"}, status=201)
