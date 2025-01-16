def calc_total_income(wage_data):
    total_income = 0
    for work_place, wage in wage_data.items():
        total_income += wage
    
    return (int)(total_income)