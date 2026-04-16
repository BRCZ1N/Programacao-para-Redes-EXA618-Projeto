from rest_framework import serializers
from .models import Playlist
from games.serializer import GameSerializer

class PlaylistSerializer(serializers.ModelSerializer):
    games = GameSerializer(many=True)
    class Meta:
        model = Playlist
        fields = '__all__'