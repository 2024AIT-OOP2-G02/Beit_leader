from flask import Flask

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
def get_dummy_data2():
    return[ {'location': '手打ちうどん恵那', 'work_time': 5.5, 'is_holyday': False},
            {'location': 'ソルジェンテ', 'work_time': 4.0, 'is_holyday': True},
            {'location': 'ご縁どり', 'work_time': 8.0, 'is_holyday': False},
            {'location': 'ラーメンなげやり', 'work_time': 6.0, 'is_holyday': True},
            {'location': 'ラーメン丸和', 'work_time': 3.0, 'is_holyday': False,},
    ]

app = Flask(__name__)

def calculate_wages(shop_data,shifts_data):
    # data1 = get_dummy_data()
    # data2 = get_dummy_data2()

    # 賃金計算結果を格納する辞書
    wages = {}

    for work_entry in shifts_data:
        # 対応する時給情報を取得
        location = work_entry['location']
        work_time = work_entry['work_time']
        is_holiday = work_entry['is_holiday']

        # locationが一致するエントリをdata1から取得
        wage_info = next((entry for entry in shop_data if entry['location'] == location), None)

        if wage_info:
            # 平日または休日の時給を選択
            hourly_wage = wage_info['holiday_wage'] if is_holiday else wage_info['weekday_wage']

            # 賃金計算
            total_salary = work_time * hourly_wage

            # location（バイト先）ごとに給与を集計
            if location in wages:
                wages[location] += total_salary
            else:
                wages[location] = total_salary

    return {location: round(salary) for location, salary in wages.items()}

def get_monthly_earnings(shifts):
    monthly_income = {month: 0 for month in range(1, 13)}

    shifts_list = [{
        'month': shift.start_time.month,
        'work_time': shift.work_time,
        'weekday_wage': shift.wage.weekday_wage,
        'holiday_wage': shift.wage.holiday_wage,
        'is_holiday': shift.is_holiday
    } for shift in shifts]

    # 月別で計算
    for shift in shifts_list:
        month = shift['month']
        wage = shift['holiday_wage'] if shift['is_holiday'] else shift['weekday_wage']
        income = shift['work_time'] * wage

        if month not in monthly_income:
            monthly_income[month] = 0
        else:
            monthly_income[month] += income

    return [{f"{month}月": int(income)} for month, income in sorted(monthly_income.items())]
