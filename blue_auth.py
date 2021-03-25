from flask import Blueprint, render_template, request, url_for, flash
from flask_login import login_user, login_required, logout_user
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import redirect

from user import User

auth = Blueprint('auth', __name__)


@auth.route("/login")
def login():
    return render_template("login.html")


@auth.route("/login", methods=['POST'])
def login_post():
    email = request.form.get('login_email')
    password = request.form.get('login_pw_hash')

    user = User.query.filter_by(user_email=email).first()

    if not user or not user.user_pw_hash == password:
        flash('Please check your login details and try again.')
        return redirect(url_for('auth.login'))

    login_user(user)
    return redirect(url_for('equipment.reval_equipment'))


@auth.route("/register", methods=['GET'])
def register():
    return render_template("register.html")


@auth.route("/register", methods=['POST'])
def register_post():
    name = request.form.get('register_name').title()
    last_name = request.form.get('register_last_name').upper()
    email = request.form.get('register_email')
    password = request.form.get('register_pw_hash')

    user_email = User.query.filter_by(user_email=email).first()
    if user_email:
        flash("Email is al in gebruik")
        return redirect(url_for('auth.register'))

    user_name = User.query.filter_by(user_last_name=last_name, user_name=name).first()
    if user_name:
        flash("Er is al een user gecontacteerd met deze naam, contacteer de admin")
        return redirect(url_for('auth.register'))

    new_user = User(user_last_name=last_name, user_name=name, user_email=email, user_pw_hash=password)
    arch_db = SQLAlchemy()
    print(new_user)
    arch_db.session.add(new_user)
    arch_db.session.commit()

    return redirect(url_for('auth.login'))

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))