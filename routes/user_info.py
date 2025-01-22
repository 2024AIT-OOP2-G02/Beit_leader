from flask import Blueprint, render_template, request, redirect, url_for
from models import User, Wage

# Blueprintの作成
user_bp = Blueprint('add', __name__, url_prefix='/add')

@user_bp.route('/', methods=['GET', 'POST'])
def add():
    if request.method == 'POST':
        user_id = request.form['user_id']
        company_id = request.form['company_id']
        weekday_wage = request.form['weekday_wage']
        holiday_wage = request.form['holiday_wage']
        User.create(name=user_id)
        Wage.create(location=company_id,weekday_wage=weekday_wage,holiday_wage=holiday_wage)
        return redirect('/')
    user = User.select()
    wages = Wage.select()
    return render_template('user_add.html', user=user,wages = wages)
