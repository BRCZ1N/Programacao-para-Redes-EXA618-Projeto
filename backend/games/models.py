from django.db import models
import uuid

class Tag(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, unique=True)

class Game(models.Model):
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    steam_id = models.BigIntegerField(unique=True)
    title = models.CharField(max_length=255)
    date_release = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2)
    tag = models.ManyToManyField(Tag)
    developer = models.JSONField()
    publisher = models.JSONField()
    description = models.TextField()
    total_reviews = models.IntegerField(default=0)
    review_rating = models.IntegerField(default=0)
    url_steam = models.URLField(blank=True, null=True)
    url_image = models.URLField(blank=True, null=True)
    active = models.BooleanField(default=True)
