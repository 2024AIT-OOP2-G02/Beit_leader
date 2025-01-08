from peewee import Model, ForeignKeyField,FloatField,DateTimeField,BooleanField
from .db import db
from .user import User
from .wage import Wage

class Shift(Model):
    user = ForeignKeyField(User, backref='shifts')
    wage = ForeignKeyField(Wage, backref='shifts')
    work_time = FloatField()
    start_date = DateTimeField()
    finish_date = DateTimeField()
    is_holyday = BooleanField()

    

    class Meta:
        database = db