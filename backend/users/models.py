from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(models.Model):
    id = models.CharField(auto_created=True, primary_key=True, unique=True, max_length=128, null=False, blank = False)
    created_at = models.DateTimeField(auto_now_add=True, null=False, blank = False)
    user_name =  models.CharField(max_length=128, null=False, blank = False)
    first_name =  models.CharField(max_length=128, null=False, blank = False)
    last_name =  models.CharField(max_length=128, null=False, blank = False)
    password = models.CharField(max_length=128, null=False, blank = False)
    email = models.EmailField(unique=True, max_length=128, null=False, blank = False)
    is_active = models.BooleanField(default = 1)
    is_staff = models.BooleanField(default = 0)