from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager
from django.core.mail import send_mail

class CustomUserManager(BaseUserManager):
    
    def create_user(self, email, password=None, **extrafields):
        if not email:
            raise ValueError ("O Email é requirido")
        email = self.normalize_email(email)
        user = self.model(email=email, **extrafields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extrafields):
        extrafields.setdefault('is_staff', True)
        extrafields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extrafields)
        

# Create your models here.
class CustomUser(AbstractUser):
    username = models.CharField(max_length=200, null=True, blank= True)
    email = models.EmailField(unique=True)
    is_trusty = models.BooleanField(default=False)
    
    def email_user(self, subject, message, from_email=None):
        send_mail(subject, message, from_email, [self.email])

    objects = CustomUserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']