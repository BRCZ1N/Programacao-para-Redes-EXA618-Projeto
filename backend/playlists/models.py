from django.db import models
from games.models import Game
import uuid

class Playlist(models.Model):
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    description = models.TextField()
    games = models.ManyToManyField(Game)
    user = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE)
    active = models.BooleanField(default=True)