from flask import Flask, render_template, redirect
from models import initialize_database, User
from routes.money import calculate_wages, get_monthly_earnings
from routes.income_analyzer import calc_total_income
from routes.user_info import user_bp
from routes.shop import shop_bp
from routes.calendar import calendar_bp
from models import Wage

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
        return render_template('index.html')

##↓↓賃金計算↓↓
@app.route('/wages', methods=['GET'])
def display_wages():
    # バイト先ごとの給与を計算
    wages_dict = calculate_wages()
    # 合計給与を計算
    total_income = calc_total_income(calculate_wages())
    # 月収を計算
    monthly_earnings=get_monthly_earnings()
    
    # 計算結果をHTMLテンプレートに渡す
    return render_template('money.html', wages=wages_dict ,total_income=total_income, monthly_earnings=monthly_earnings)

# 合計給与の計算・103万グラフの描画
@app.route('/103_graph', methods=['GET'])
def display_103_graph():
    total_income = calc_total_income(calculate_wages())
    return render_template('total_income.html', total_income=total_income)

# カレンダーの表示
@app.route('/calendar', methods=['GET'])
def display_calendar():
    wages = Wage.select()
    # print("------------------------------------")
    # print("unko3")
    # print("------------------------------------")
    return render_template('calendar.html', shops=wages)

# メイン関数
if __name__ == '__main__':
    app.run(debug=True)

