from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from games.services.crawler_service import start_crawler
from games.services.game_service import save_games
from .models import Game
from .serializer import GameSerializer

@api_view(['GET'])
def game(request):
    games = Game.objects.all()
    serializer = GameSerializer(games, many=True)
    return Response({"games": serializer.data})

@api_view(["POST"])
def crawl_games_view(request):
    games = start_crawler()
    save_games(games)

    return Response({"status": "ok"})

