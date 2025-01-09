from flask import Blueprint, render_template, request, redirect, url_for
from models import User, Product

# Blueprintの作成
user_bp = Blueprint('add', __name__, url_prefix='/add')


@user_bp.route('/')
def add():
    if request.method == 'POST':
        user_id = request.form['user_id']
        company_id = request.form['company_id']
        User.create(user=user_id)
        User.create(company=company_id)
        return redirect(url_for('user.list'))
    users = User.select()
    return render_template('user_add.html', users=users)


@user_bp.route('/edit/<int:User_id>', methods=['GET', 'POST'])
def edit(User_id):
    user = User.get_or_none(User.id == User_id)
    if not user:
        return redirect(url_for('user.list'))

    if request.method == 'POST':
        user.user = request.form['user_id']
        user.product = request.form['product_id']
        user.save()
        return redirect(url_for('user.list'))

    users = User.select()
    products = Product.select()
    return render_template('user_edit.html', user=user, users=users, products=products)
