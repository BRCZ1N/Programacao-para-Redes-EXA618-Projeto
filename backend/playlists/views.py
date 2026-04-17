from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from .models import Playlist
from games.models import Game
from .serializer import PlaylistSerializer
from games.serializer import GamePreviewSerializer

@api_view(['GET'])
def home(request):
    return Response({"playlists": []})

@api_view(['POST'])
def generate_playlist(request):
    
    markers = request.data.get("genre")
    min_rating = request.data.get("min_rating")
    min_value = request.data.get("min_value")
    min_review = request.data.get("min_review")
    min_rating = request.data.get("min_rating")

    if markers:
        games = games.filter(markers=markers)

    if min_rating:
        games = games.filter(rating__gte=min_rating)
        
    if min_value:
        games = games.filter(discount_price__gte=min_value)
        
    if min_review:
        games = games.filter(total_reviews__gte=min_review)
        
    if min_rating:
        games = games.filter(review_rating__gte=min_rating)
        
    games = games.order_by('-review_rating', '-total_reviews')[:5]

    if not games:
        return Response({"error": "Nenhum jogo encontrado"}, status=400)
    
    serializer = GamePreviewSerializer(games, many=True)
    
    return Response({
        "games": serializer.data
    })

@api_view(['POST', 'GET'])
def playlist(request):
    
    if request.method == 'GET':
        
        if not request.user.is_authenticated:
            return Response({"error": "Login necessário"}, status=401)
        
        query = Playlist.objects.filter(user=request.user).prefetch_related('games')
    
        paginator = PageNumberPagination()
        paginator.page_size = 10
        
        result_page = paginator.paginate_queryset(query, request)
        
        serializer = PlaylistSerializer(result_page, many = True)
        
        return paginator.get_paginated_response(serializer.data)
        
    if request.method == 'POST':
        
        title = request.data.get("title")
        description = request.data.get("description")
        game_ids = request.data.get("games", [])
        
        games = Game.objects.filter(id__in=game_ids)

        if len(games) != len(game_ids):
            return Response({"error": "Playlist inválida"}, status=400)
       
        playlist = Playlist.objects.create(title=title or "", description=description or "")
        playlist.games.set(games)
        

@api_view(['GET', 'PUT', 'DELETE'])
def playlist_detail(request):
    return Response({"playlists": []})
