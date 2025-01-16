from peewee import Model,CharField,FloatField
from .db import db

class Wage(Model):
    location = CharField() # 勤務地
    weekday_wage = FloatField() # 平日時給
    holiday_wage = FloatField() # 休日時給
    
    class Meta:
        database = db