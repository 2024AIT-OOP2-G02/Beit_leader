from flask import Blueprint, render_template, request, redirect, url_for
from models import Wage

# Blueprintの作成
shop_bp = Blueprint('shop', __name__, url_prefix='/shop')


@shop_bp.route('/')
def list():
    wages = Wage.select()
    return render_template('shop_list.html',shops = wages)
    
@shop_bp.route('/add', methods=['GET', 'POST'])
def add():
        if request.method == 'POST':
            company_id = request.form['company_id']
            weekday_wage = request.form['weekday_wage']
            holiday_wage = request.form['holiday_wage']
            Wage.create(location=company_id,weekday_wage=weekday_wage,holiday_wage=holiday_wage)
            return redirect(url_for("display_wages"))
        wages = Wage.select()
        return render_template('shop_add.html',shops = wages)