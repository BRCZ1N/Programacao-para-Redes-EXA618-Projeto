from django.urls import path
from playlists.views import playlist_detail, playlist
from games.views import game_list,crawl_games, game_list_featured, search_games_per_title , tag_list, search_games_per_id
from users.views import register_user,me,delete_user, logout, update_user
from users.cookies import CookieTokenObtainPairView, CookieTokenRefreshView

urlpatterns = [
   
    path('api/crawler/', crawl_games),

    path('api/games/search/', search_games_per_title),
    path('api/games/featured/', game_list_featured),
    path('api/games/', game_list),
    path('api/games/tag/', tag_list),
    path('api/games/<uuid:pk>/', search_games_per_id),

    path('api/playlist/', playlist),
    path('api/playlist/<uuid:pk>/', playlist_detail),

    path('api/user/register/', register_user),
    path('api/user/delete/', delete_user),
    path('api/user/me/', me),
    path('api/user/update/', update_user),

    path('api/auth/login/', CookieTokenObtainPairView.as_view()),
    path('api/auth/refresh/', CookieTokenRefreshView.as_view()),
    path('api/auth/logout/', logout),


]
