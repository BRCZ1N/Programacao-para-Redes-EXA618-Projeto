from rest_framework import serializers
from .models import Playlist
from games.serializers import GameSerializer

class PlaylistSerializer(serializers.ModelSerializer):
    games = GameSerializer(many=True)
    class Meta:
        model = Playlist
        fields = '__all__'


class PlaylistUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Playlist
        fields = ['title', 'description', 'active']
