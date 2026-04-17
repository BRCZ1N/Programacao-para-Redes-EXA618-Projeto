from games.models import Game

def save_games(game_dtos):
    for dto in game_dtos:
        Game.objects.update_or_create(
            steam_id=dto.id,
            defaults={
                "title": dto.title,
                "price": dto.price,
                "discount_price": dto.discount_price,
                "description": dto.description,
                "date_release": dto.date_release,
                "tags": dto.tags,
                "developer": dto.developer,
                "publisher": dto.publisher,
                "total_reviews": dto.total_reviews,
                "review_rating": dto.review_rating,
                "url_steam": dto.url,
                "url_image": dto.url_image,
            }
        )