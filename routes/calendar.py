
from flask import Blueprint, render_template, request, redirect, url_for
from models import Shift, Wage
from datetime import datetime as dt

# Blueprintの作成
calendar_bp = Blueprint('calendar', __name__, url_prefix='/calendar')

@calendar_bp.route('/')
def index():
    shops = Wage.select()
    shifts = Shift.select()
    shifts_list = [{
        'id': shift.id,
        'start_time': shift.start_time.strftime('%Y-%m-%d %H:%M:%S'),
        'finish_time': shift.finish_time.strftime('%Y-%m-%d %H:%M:%S'),
        'location': shift.wage.location,
        'is_holiday': shift.is_holiday
    } for shift in shifts]
    return render_template('calendar.html', shops=shops, shifts=shifts_list)


@calendar_bp.route('/add', methods=['GET', 'POST'])
def add():
        # print(request.method)
        if request.method == 'POST':
            # print("入力した値",request.form)
            try:
                shift_date = request.form['shift_date']
                shift_in = request.form['shift_in']
                shift_out = request.form['shift_out']
                location = request.form['location']
            except KeyError as e:
            # エラーハンドリング
                return redirect(url_for('calendar.add'))

            # 日付と時間を結合してdatetimeオブジェクトに変換
            start_time = dt.strptime(f"{shift_date} {shift_in}", '%Y-%m-%d %H:%M')
            finish_time = dt.strptime(f"{shift_date} {shift_out}", '%Y-%m-%d %H:%M')

            # Wageテーブルからlocationに対応するwage_idを取得
            wage = Wage.get_or_none(Wage.location == location)
            if not wage:
                # もし該当するWageがなければ、新しいWageを作成
                wage = Wage.create(location=location, weekday_wage=0, holiday_wage=0)

            # 入力値のチェック
            if start_time > finish_time:
                return redirect(url_for('calendar.add'))
            
            # 休日かどうかを判定
            if(start_time.strftime('%a') == 'Sat' or start_time.strftime('%a') == 'Sun'):
                is_holiday = True
            else:
                is_holiday = False
            
            work_time = (finish_time - start_time).total_seconds() / 3600
            
            # Shiftテーブルに新しいシフトを追加
            Shift.create(
                wage=wage,
                work_time=round(work_time,2),  # 勤務時間を計算
                start_time=start_time,
                finish_time=finish_time,
                is_holiday=is_holiday
            )
            return redirect(url_for('calendar.add'))
        
        else:
            shifts = Shift.select()
            wages = Wage.select()
            shifts_list = [{
            'start': shift.start_time.strftime('%Y-%m-%d %H:%M:%S'),
            'finish': shift.finish_time.strftime('%Y-%m-%d %H:%M:%S'),
            'title': shift.wage.location
            } for shift in shifts]
            return render_template('calendar.html', shops=wages, shifts=shifts_list)