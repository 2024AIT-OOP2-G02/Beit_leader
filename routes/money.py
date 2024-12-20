from peewee import fn
from models.shift import Wage as Shift
from models.wage import Wage

def calculate_wages():

    # バイト名ごとに給与を集計
    query = (
    Shift
    .select(
        Wage.location,  # バイト先（場所）
        fn.SUM(
            Shift.work_time * 
            fn.IF(Shift.is_holyday, Wage.holyday_wage, Wage.weekday_wage)  # 平日または休日の時給
        ).alias('total_salary')  # 合計給与としてエイリアスを付ける
    )
    .join(Wage, on=(Shift.wage == Wage.id))  # Shift と Wage を wage フィールドで結合
    .group_by(Wage.location)  # location（バイト先）ごとにグループ化
)
    
    # 結果を辞書型に変換して返す
    results = {}
    for entry in query.dicts():
        results[entry['location']] = round(entry['total_salary'], 2)
    
    return results

def calculate_salaries(data):


    salaries = []
    for workplace, hours, hourly_wage in data:
        salary = hours * hourly_wage
        salaries.append({
            'workplace': workplace,
            'salary': round(salary, 2)  # 小数点以下2桁で丸める
        })
    return salaries