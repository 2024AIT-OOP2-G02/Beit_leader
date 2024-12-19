from peewee import Model, CharField
from .db import db

class User(Model):
    name = CharField()
    

    class Meta:
        database = db