from rest_framework import serializers, validators
from .models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'password', 'first_name', 'last_name', 'username']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
        }

    def create(self, validated_data):
        password = validated_data.pop("password")

        user = CustomUser(
            **validated_data
        )
        user.set_password(password)
        user.save()
        return user
    
    
class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username','password', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}, 'required': False}

    def update(self, instance, validated_data):

        password = validated_data.pop('password', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance
    
    def validate(self, attrs):
        allowed = set(self.fields.keys())
        incoming = set(self.initial_data.keys())

        unknown = incoming - allowed

        if unknown:
            raise serializers.ValidationError({
                "error": f"Campos inválidos: {unknown}"
            })

        return attrs
    
class PerfilSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'first_name', 'last_name']