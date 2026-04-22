from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from .serializers import RegisterSerializer, PerfilSerializer, UserUpdateSerializer, CustomUser
from .models import CustomUser
from django.contrib.auth import views as auth_views
from django.core.mail import send_mail
from .models import PasswordResetToken
from decouple import config

@api_view(['POST'])
def logout(request):
    res = Response({"ok": True})
    res.delete_cookie("access")
    res.delete_cookie("refresh")
    return res
    
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):

    serializer = RegisterSerializer(data=request.data)

    if not serializer.is_valid():
        return Response({"Erro": serializer.errors}, status=400)
        
    serializer.save()
    return Response({"status": "Cadastro realizado com sucesso"}, status=201)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_user(request):

    email = request.data.get("email")

    if not email:
        
        return Response(
            {"error": "Email é obrigatório"},status=400)

    user = CustomUser.objects.get(email=email)

    if not user:

        return Response({"status": "Usuário não encontrado"}, status=404)
    
    user.delete()
    return Response(status=204)
        

@api_view(['GET','PUT'])
@permission_classes([IsAuthenticated])
def me(request):

    if request.method == 'GET':

        serializer = PerfilSerializer(request.user)
        
        return Response(serializer.data, status=200)
    
    if request.method == 'PUT':

        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({"status": "Dados atualizados com sucesso"}, status=200)
            
        return Response({"Erro": serializer.errors}, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset(request):

    email = request.data.get("email")

    if not email:
        
        return Response(
            {"error": "Email é obrigatório"},status=400)

    user = CustomUser.objects.get(email=email)

    if not user:

        return Response({"status": "Usuário não encontrado"}, status=404)
    
    token_obj = PasswordResetToken.objects.create(user=user)

    reset_link = f"https://FALTA FAZER O FRONT DISSO/reset-password?token={token_obj.token}"

    send_mail(
        subject="Password reset",
        message=f"Use este link: {reset_link}",
        from_email=config("EMAIL_HOST_USER"),
        recipient_list=[user.email],
    )

    return Response({"status": "email_sent"})
    
