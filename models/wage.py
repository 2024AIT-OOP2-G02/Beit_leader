from peewee import Model, ForeignKeyField, CharField,FloatField
from .db import db
from .user import User

class Wage(Model):
    user = ForeignKeyField(User, backref='wages')
    location = CharField()
    weekday_wage = FloatField()
    holyday_wage = FloatField()
    

    class Meta:
        database = db