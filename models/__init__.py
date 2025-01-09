from peewee import SqliteDatabase
from .db import db
from .user import User
from .shift import Shift
from .wage import Wage

# モデルのリストを定義しておくと、後でまとめて登録しやすくなります
MODELS = [
    User,
    Shift,
    Wage
]

# データベースの初期化関数
def initialize_database():
    db.connect()
    db.create_tables(MODELS, safe=True)
    db.close()