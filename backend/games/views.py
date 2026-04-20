from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.pagination import PageNumberPagination
from games.services.crawler_service import start_crawler
from games.services.game_service import save_games
from users.permissions import IsSuperUser
from rest_framework.permissions import IsAuthenticated
from .models import Game
from .serializers import GamePreviewSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def game(request):
    
    query = Game.objects.all()
    
    paginator = PageNumberPagination()
    paginator.page_size = 10
        
    result_page = paginator.paginate_queryset(query, request)

    serializer = GamePreviewSerializer(result_page, many=True)
    return Response(serializer.data)
        

@api_view(["POST"])
@permission_classes([IsSuperUser])  
def crawl_games(request):
    games = start_crawler()
    save_games(games)

    return Response({"status": "ok"})

