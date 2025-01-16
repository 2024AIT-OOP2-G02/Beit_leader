from peewee import Model, ForeignKeyField,FloatField,DateTimeField,BooleanField
from .db import db
from .wage import Wage

class Shift(Model):
    wage = ForeignKeyField(Wage, backref='shifts') # wageテーブルとの外部キー
    work_time = FloatField() # 勤務時間
    start_time = DateTimeField() # 勤務開始時間
    finish_time = DateTimeField() # 勤務終了時間
    is_holiday = BooleanField(default=False) # 休日かどうか
    
    class Meta:
        database = db