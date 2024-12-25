from flask import Flask, render_template
from routes.money import calculate_wages

app = Flask(__name__)

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

if __name__ == '__main__':
    app.run(debug=True)