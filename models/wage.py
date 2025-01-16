from peewee import Model,CharField,FloatField,IntegerField
from .db import db

class Wage(Model):
    location = CharField() # 勤務地
    weekday_wage = IntegerField() # 平日時給
    holiday_wage = IntegerField() # 休日時給
    

    class Meta:
        database = db