from games.models import Game, Tag

def save_games(game_dtos):
    for dto in game_dtos:

        game, created = Game.objects.update_or_create(
            steam_id=dto.id,
            defaults={
                "title": dto.title,
                "price": dto.price,
                "discount_price": dto.discount_price,
                "description": dto.description,
                "date_release": dto.date_release,
                "developer": dto.developer,
                "publisher": dto.publisher,
                "total_reviews": dto.total_reviews,
                "review_rating": dto.review_rating,
                "url_steam": dto.url,
                "url_image": dto.url_image,
            }
        )
        if dto.tag:
            tags_list = []

            for name in dto.tag:
                tag_obj, _ = Tag.objects.get_or_create(name=name)
                tags_list.append(tag_obj)

            game.tag.set(tags_list)