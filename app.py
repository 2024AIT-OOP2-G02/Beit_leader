from flask import Flask, render_template, Blueprint
from models import initialize_database
from routes.money import calculate_wages
from routes.income_analyzer import calc_total_income

app = Flask(__name__)

# データベースの初期化
initialize_database()


# デフォルトページ（index.html）を表示
@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

##↓↓賃金計算↓↓
@app.route('/wages', methods=['GET'])
def display_wages():
    # バイトごとの給与を計算
    wages_dict = calculate_wages()
    
    # 計算結果をHTMLテンプレートに渡す
    return render_template('money.html', wages=wages_dict)

# 合計給与の計算・103万グラフの描画
@app.route('/103_graph', methods=['GET'])
def display_103_graph():
    total_income = calc_total_income(calculate_wages())
    return render_template('total_income.html', total_income = total_income)

if __name__ == '__main__':
    app.run(debug=True)

