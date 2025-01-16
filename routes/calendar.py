from flask import Blueprint, render_template, request, redirect, url_for
from models import Shift
from datetime import datetime
from datetime import datetime as dt
from peewee import fn

# from django.utils import timezone

# Blueprintの作成
calendar_bp = Blueprint('calendar', __name__, url_prefix='/calendar')


@calendar_bp.route('/', methods=['GET', 'POST'])
def add():
        if request.method == 'POST':
            shift_date = request.form['shift_date']
            shift_out = request.form['shift_out']
            shift_in = request.form['shift_in']
            
            shift_date = dt.strptime(shift_date, '%Y-%m-%d')
            # tdatetime = datetime.datetime.strptime(shift_date, '%Y-%m-%d %H:%M:%S')
            # shift_date = datetime.date(tdatetime.year, tdatetime.month, tdatetime.day)
            print("_________________________________________________________________________")
            print("datetime成功")
            print("_________________________________________________________________________")
            # datetime_obj = datetime.strptime(shift_date, '%Y-%m-%d')
            # tdatetime = datetime.datetime.strptime(shift_in, '%H:%M:%S')
            # shift_in = datetime.date(tdatetime.hour, tdatetime.minute, tdatetime.second)
            # tdatetime = datetime.datetime.strptime(shift_out, '%H:%M:%S')
            # shift_out = datetime.date(tdatetime.hour, tdatetime.minute, tdatetime.second)
            shift_in = dt.strptime(shift_in, '%H:%M')
            shift_out = dt.strptime(shift_out, '%H:%M')
            print("_________________________________________________________________________")
            print(type(shift_date))
            print("_________________________________________________________________________")
            # datetime_obj = datetime.strptime(shift_date, '%Y-%m-%d')
            # model_instance.date_field = datetime_obj
            Shift.create(start_time=shift_in,finish_time=shift_out)
            print("_________________________________________________________________________")
            print("unko2")
            print("_________________________________________________________________________")
            return redirect(url_for('calendar.add'))
        print("_________________________________________________________________________")
        print("unko3")
        print("_________________________________________________________________________")
        return render_template('calendar.html')
        
        # users = User.select()
        # wages = Wage.select()
        # return render_template('user_add.html', users=users,wages = wages)
        