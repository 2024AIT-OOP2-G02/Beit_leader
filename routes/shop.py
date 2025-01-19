from flask import Blueprint, render_template, request, redirect, url_for
from models import Wage

# Blueprintの作成
shop_bp = Blueprint('shop', __name__, url_prefix='/shop')


@shop_bp.route('/')
def list():
    wages = Wage.select()
    return render_template('shop_add.html',shops = wages)
    
@shop_bp.route('/add', methods=['GET', 'POST'])
def add():
        if request.method == 'POST':
            company_id = request.form['company_id']
            weekday_wage = request.form['weekday_wage']
            holiday_wage = request.form['holiday_wage']
            Wage.create(location=company_id,weekday_wage=weekday_wage,holiday_wage=holiday_wage)
            return redirect(url_for("shop.list"))
        wages = Wage.select()
        return render_template('shop_add.html',shops = wages)
   
@shop_bp.route('/delete', methods=['POST']) 
def delete():
    if request.method == 'POST':
        shop_name = request.form['shop_name']
        Wage.delete().where(Wage.location == shop_name).execute()
        return redirect(url_for("shop.list"))
    wages = Wage.select()
    return render_template('shop_add.html',shops = wages)