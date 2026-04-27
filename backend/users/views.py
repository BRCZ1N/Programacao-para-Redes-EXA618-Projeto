from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from .serializers import RegisterSerializer, PerfilSerializer, UserUpdateSerializer, CustomUser
from .models import CustomUser
from django.core.mail import send_mail
from .models import PasswordResetToken
from decouple import config

@api_view(['POST'])
def logout(request):
    res = Response({"status": "Usuário deslogado com sucesso"})

    res.delete_cookie(
        "access",
        path="/",
        secure=True,
        samesite="None",
    )

    res.delete_cookie(
        "refresh",
        path="/",
        secure=True,
        samesite="None",
    )

    return res

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_user(request):
    user = request.user

    username = request.data.get("username")
    first_name = request.data.get("first_name")
    last_name = request.data.get("last_name")
    password = request.data.get("password")

    if username is not None:
        user.username = username

    if first_name is not None:
        user.first_name = first_name

    if last_name is not None:
        user.last_name = last_name
    
    if password:
        user.set_password(password)

    user.save()

    return Response({
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
    })

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
    
