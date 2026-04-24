from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.pagination import PageNumberPagination
from games.services.crawler_service import start_crawler
from games.services.game_service import save_games
from users.permissions import IsSuperUser
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Game
from .serializers import GameDetailSerializer, GameGridSerializer, GameViewSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def game_list(request):
    query = Game.objects.all().order_by("id")

    paginator = PageNumberPagination()
    paginator.page_size = 12

    result_page = paginator.paginate_queryset(query, request)

    serializer = GameGridSerializer(result_page, many=True)

    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def game_featured(request):

    type_ = request.query_params.get("type", "trending")

    query = Game.objects.all()

    if type_ == "trending":
        query = query.order_by("-total_reviews")

    elif type_ == "top":
        query = query.order_by("-review_rating")

    elif type_ == "new":
        query = query.order_by("-date_release")

    elif type_ == "discount":
        query = query.filter(discount_price__isnull=False)

    games = query[:12]

    serializer = GameViewSerializer(games, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def game_detail(request, pk):
    game = Game.objects.get(id=pk)

    serializer = GameDetailSerializer(game)
    return Response(serializer.data)
        

@api_view(["POST"])
@permission_classes([AllowAny])  
def crawl_games(request):
    games = start_crawler()
    save_games(games)

    return Response({"status": "ok"})

