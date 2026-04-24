from rest_framework import serializers
from .models import Game,Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['name']

class GameSerializer(serializers.ModelSerializer):
    tag = TagSerializer(many=True)
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
