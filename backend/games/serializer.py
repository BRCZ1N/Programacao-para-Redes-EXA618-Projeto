from rest_framework import serializers
from .models import Game

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = '__all__'
        
        
class GamePreviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = [
            'id',
            'title',
            'discount_price',
            'price',
            'review_rating',
            'total_reviews',
            'url_image',
            'url_steam'
        ]