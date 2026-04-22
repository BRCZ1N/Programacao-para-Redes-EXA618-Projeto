from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.response import Response

class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        access = response.data["access"]
        refresh = response.data["refresh"]

        response = Response({"ok": True})

        response.set_cookie(
            "access",   
            access,
            httponly=True,
            secure=False, 
            samesite="Lax",
            path="/",
            max_age=60 * 30,
        )

        response.set_cookie(
            "refresh",
            refresh,
            httponly=True,
            secure=False,
            samesite="Lax",
            path="/",
            max_age=60 * 60 * 24 * 7,
        )

        return response
    
class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh = request.COOKIES.get("refresh")

        request.data["refresh"] = refresh

        response = super().post(request, *args, **kwargs)

        access = response.data["access"]

        response = Response({"ok": True})

        response.set_cookie(
            "access",
            access,
            httponly=True,
            samesite="Lax",
            path="/",
            max_age=60 * 30,
        )

        return response