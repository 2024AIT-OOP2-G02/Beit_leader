from flask import Flask, render_template, redirect, url_for
from models import initialize_database, User, Wage, Shift
from routes.money import calculate_wages, get_monthly_earnings
from routes.income_analyzer import calc_total_income,calc_average_income
from routes.user_info import user_bp
from routes.shop import shop_bp
from routes.calendar import calendar_bp

app = Flask(__name__)

# データベースの初期化
initialize_database()

# add用
app.register_blueprint(user_bp)
app.register_blueprint(shop_bp)
app.register_blueprint(calendar_bp)

#デフォルトページ（index.html）を表示
@app.route('/', methods=['GET'])
def home():
    userCount = User.select().count()
    if userCount==0:
        return redirect('/add')
    else:
        user = User.select()
        # print(user.name)
        return redirect(url_for('display_wages'))

##↓↓賃金計算↓↓
@app.route('/wages', methods=['GET'])
def display_wages():
    
    shops = Wage.select()
    shifts = Shift.select()
    
    shops_list = [{
        'location': shop.location,
        'weekday_wage': shop.weekday_wage,
        'holiday_wage': shop.holiday_wage
    } for shop in shops]

    shifts_list = [{
        'id': shift.id,
        'work_time': shift.work_time,
        'location': shift.wage.location,
        'is_holiday': shift.is_holiday
    } for shift in shifts]
    
    # バイト先ごとの給与を計算
    wages_dict = calculate_wages(shops_list,shifts_list)
    # 合計給与を計算
    total_income = calc_total_income(calculate_wages(shops_list,shifts_list))
    # 〇〇万の形にフォーマット
    formatted_total_income = round((total_income / 10000))
    # 月収を計算
    monthly_earnings=get_monthly_earnings(shifts)
    expect_earnings = round(calc_average_income(monthly_earnings) / 10000) * 12
    # 見込み稼ぎを計算
    # 計算結果をHTMLテンプレートに渡す
    user = User.select()
    return render_template('money.html', wages=wages_dict ,total_income=total_income,formatted_total_income = formatted_total_income,expect_earnings= expect_earnings ,monthly_earnings=monthly_earnings,user=user)

# 合計給与の計算・103万グラフの描画
@app.route('/103_graph', methods=['GET'])
def display_103_graph():
    user = User.select()
    shops = Wage.select()
    shifts = Shift.select()
    shops_list = [{
        'location': shop.location,
        'weekday_wage': shop.weekday_wage,
        'holiday_wage': shop.holiday_wage
    } for shop in shops]

    shifts_list = [{
        'id': shift.id,
        'work_time': shift.work_time,
        'location': shift.wage.location,
        'is_holiday': shift.is_holiday
    } for shift in shifts]

    total_income = calc_total_income(calculate_wages(shops_list,shifts_list))
    return render_template('total_income.html', total_income=total_income)

# メイン関数
if __name__ == '__main__':
    app.run(debug=True,port=8888)
