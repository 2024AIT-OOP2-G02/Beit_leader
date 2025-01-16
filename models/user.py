from peewee import Model, CharField
from .db import db

class User(Model):
    name = CharField() # ユーザー名
    
    class Meta:
        database = db