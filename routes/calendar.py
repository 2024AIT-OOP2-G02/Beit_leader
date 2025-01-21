
from flask import Blueprint, render_template, request, redirect, url_for
from models import Shift, Wage
from datetime import datetime as dt

# Blueprintの作成
calendar_bp = Blueprint('calendar', __name__, url_prefix='/calendar')

# @calendar_bp.route('/', methods=['GET'])
# def list():
#     shifts = Shift.select()
#     wages = Wage.select()
#     return render_template('calendar.html', shops=wages, shifts=shifts)
@calendar_bp.route('/')
def index():
    shops = Wage.select()
    wages = Wage.select()
    return render_template('calendar.html', shops=shops, shifts=wages)


@calendar_bp.route('/add', methods=['GET', 'POST'])
def add():
        
        if request.method == 'POST':
            print(request.form)
            try:
                shift_date = request.form['shift_date']
                shift_in = request.form['shift_in']
                shift_out = request.form['shift_out']
                location = request.form['location']
            except KeyError as e:
            # エラーハンドリング
                return "Missing form data", 400

            # 日付と時間を結合してdatetimeオブジェクトに変換
            start_time = dt.strptime(f"{shift_date} {shift_in}", '%Y-%m-%d %H:%M')
            finish_time = dt.strptime(f"{shift_date} {shift_out}", '%Y-%m-%d %H:%M')

            # Wageテーブルからlocationに対応するwage_idを取得
            wage = Wage.get_or_none(Wage.location == location)
            if not wage:
                # もし該当するWageがなければ、新しいWageを作成
                wage = Wage.create(location=location, weekday_wage=0, holiday_wage=0)

            # Shiftテーブルに新しいシフトを追加
            Shift.create(
                wage=wage,
                work_time=(finish_time - start_time).total_seconds() / 3600,  # 勤務時間を計算
                start_time=start_time,
                finish_time=finish_time,
                is_holiday=False  # 休日かどうかはデフォルトでFalse
            )
            return redirect(url_for('calendar.add'))
        
        else:
            shifts = Shift.select()
            wages = Wage.select()
            return render_template('calendar.html', shops=wages, shifts=shifts)