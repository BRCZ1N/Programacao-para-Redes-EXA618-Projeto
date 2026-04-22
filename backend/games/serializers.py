from rest_framework import serializers
from .models import Game

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = '__all__'
        
        
class GameDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = [
            'id',
            'steam_id',
            'title',
            'discount_price',
            'description',
            'price',
            'review_rating',
            'total_reviews',
            'url_image',
            'url_steam'
        ]

class GameGridSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = [
            'id',
            'title',
            'url_image',
        ]