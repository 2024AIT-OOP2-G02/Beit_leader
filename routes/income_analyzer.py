def calc_total_income(wage_data):
    total_income = 0
    for work_place, wage in wage_data.items():
        total_income += wage
    
    return (int)(total_income)

def calc_average_income(wage_data):
    sum_income = 0
    for month_data in wage_data:
        sum_income += list(month_data.values())[0]
        
    return (sum_income / 12)