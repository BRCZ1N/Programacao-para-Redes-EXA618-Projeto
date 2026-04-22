from django.urls import path
from playlists.views import generate_playlist,playlist_detail,playlist
from games.views import game_detail,game_list,crawl_games
from users.views import register_user,me,password_reset,delete_user
from users.cookies import CookieTokenObtainPairView, CookieTokenRefreshView

urlpatterns = [
    #path('', home),
    path('api/crawler/', crawl_games),
    path('api/games/<int:id>/', game_detail),
    path('api/games/', game_list),

    path('api/playlist/generate', generate_playlist),
    path('api/playlist/', playlist),
    path('api/playlist/<int:id>/', playlist_detail),

    path('api/user/register/', register_user),
    path('api/user/delete/', delete_user),
    path('api/user/me/', me),

    path('api/auth/login/', CookieTokenObtainPairView.as_view()),
    path('api/auth/refresh/', CookieTokenRefreshView.as_view()),
  
    path('api/password-reset/', password_reset),
]
