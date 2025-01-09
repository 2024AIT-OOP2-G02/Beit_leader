from flask import Flask, send_from_directory, jsonify, request
from datetime import datetime, timedelta

app = Flask(__name__, static_folder='static')


# サンプルシフトデータ
shifts = {
    "2024-12-25": ["09:00-13:00: 田中", "14:00-18:00: 鈴木"],
    "2024-12-26": ["10:00-14:00: 高橋"]
}

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'calendar.html')

@app.route('/get_shifts', methods=['GET'])
def get_shifts():
    return jsonify(shifts)

@app.route('/add_shift', methods=['POST'])
def add_shift():
    data = request.json
    date = data.get('date')
    shift_details = data.get('details')

    if date and shift_details:
        if date not in shifts:
            shifts[date] = []
        shifts[date].append(shift_details)
        return jsonify({"message": "シフトが正常に追加されました。"}), 200
    return jsonify({"message": "無効なデータです。"}), 400


if __name__ == '__main__':
    app.run(debug=True)
