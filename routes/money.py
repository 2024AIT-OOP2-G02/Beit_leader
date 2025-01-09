# money.py
from peewee import fn

# ダミーデータ1
#ユーザー登録から読み取る
def get_dummy_data():
    return [
        {'location': '手打ちうどん恵那', 'weekday_wage': 1000, 'holyday_wage': 1200},
        {'location': 'ソルジェンテ', 'weekday_wage': 1000, 'holyday_wage': 1200},
        {'location': 'ご縁どり', 'weekday_wage': 1100, 'holyday_wage': 1300},
        {'location': 'ラーメンなげやり', 'weekday_wage': 1100, 'holyday_wage': 1300},
        {'location': 'ラーメン丸和', 'weekday_wage': 900, 'holyday_wage': 1000},
    ]

#ダミーデータ2
#カレンダーから受け取る
def get_dummy_tathunami():
    return[ {'location': '手打ちうどん恵那', 'work_time': 5.5, 'is_holyday': False},
            {'location': 'ソルジェンテ', 'work_time': 4.0, 'is_holyday': True},
            {'location': 'ご縁どり', 'work_time': 8.0, 'is_holyday': False},
            {'location': 'ラーメンなげやり', 'work_time': 6.0, 'is_holyday': True},
            {'location': 'ラーメン丸和', 'work_time': 3.0, 'is_holyday': False,},
    ]

def calculate_wages():
    data1 = get_dummy_data()
    data2 = get_dummy_tathunami()

    # 賃金計算結果を格納する辞書
    wages = {}

    for work_entry in data2:
        # 対応する時給情報を取得
        location = work_entry['location']
        work_time = work_entry['work_time']
        is_holyday = work_entry['is_holyday']

        # locationが一致するエントリをdata1から取得
        wage_info = next((entry for entry in data1 if entry['location'] == location), None)

        if wage_info:
            # 平日または休日の時給を選択
            hourly_wage = wage_info['holyday_wage'] if is_holyday else wage_info['weekday_wage']

            # 賃金計算
            total_salary = work_time * hourly_wage

            # location（バイト先）ごとに給与を集計
            if location in wages:
                wages[location] += total_salary
            else:
                wages[location] = total_salary

    # 小数点以下2桁で丸める
    return {location: round(salary, 2) for location, salary in wages.items()}

def get_monthly_earnings():
    # ダミーデータを使用して月ごとの収入を計算
    return [
        {"1月": 30000},
        {"2月": 25000},
        {"3月": 40000},
        {"4月": 35000},
        {"5月": 45000},
        {"6月": 30000},
        {"7月": 50000},
        {"8月": 60000},
        {"9月": 55000},
        {"10月": 70000},
        {"11月": 65000},
        {"12月": 80000}
    ]

# 計算結果を出力するテスト
if __name__ == "__main__":
    result = calculate_wages()
    for location, salary in result.items():
        print(f"{location}: {salary}円")
