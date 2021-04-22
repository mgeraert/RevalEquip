import os

from flask import Blueprint, render_template, request, url_for, flash, current_app
from flask_login import login_required, logout_user, login_user
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import redirect, secure_filename
from classes.Model import Document, User, Picture

auth = Blueprint('auth', __name__)


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in current_app.config['ALLOWED_EXTENSIONS']


@auth.route("/login")
def login():
    return render_template("login.html")


@auth.route("/login", methods=['POST'])
def login_post():
    email = request.form.get('login_email')
    pw_hash = request.form.get('login_pw_hash')

    user = User.query.filter_by(user_email=email).first()

    if not user or not user.user_pw_hash == pw_hash:
        flash('Please check your login details and try again.')
        return redirect(url_for('auth.login'))

    if user.is_allowed() == 0:
        flash('You have not been given access to the database yet. You will receive an email when accepted.')
        return redirect(url_for('auth.login'))

    login_user(user)

    if user.completed_profile() == 0:
        flash('Please complete your profile before continuing.')
        return redirect(url_for('profile._profile'))
    else:
        flash('Successfully logged in.')
        return redirect(url_for('equipment._equipment'))


@auth.route("/register", methods=['GET'])
def register():
    return render_template("register.html")


@auth.route("/register", methods=['POST'])
def register_post():
    name = request.form.get('register_name').title()
    last_name = request.form.get('register_last_name').upper()
    email = request.form.get('register_email')
    file = request.files['file']

    user_email = User.query.filter_by(user_email=email).first()
    if user_email:
        flash("Email already in use.")
        return redirect(url_for('auth.register'))

    user_name = User.query.filter_by(user_last_name=last_name, user_name=name).first()
    if user_name:
        flash("There is already an account been made with this name. Contact the admin.")
        return redirect(url_for('auth.register'))

    new_user = User(user_last_name=last_name, user_name=name, user_email=email)
    arch_db = SQLAlchemy()
    arch_db.session.add(new_user)
    arch_db.session.commit()

    if not file or not allowed_file(file.filename):
        flash("Please upload an allowed file.")
        arch_db.session.delete(new_user)
        arch_db.session.commit()
        return redirect(url_for('auth.register'))

    user = User.query.filter_by(user_email=new_user.get_email()).first()
    user_id = user.get_id()
    filename = 'user_register_upload_id_' + str(user_id) + '_filename_' + secure_filename(file.filename)
    file_type = filename.rsplit('.', 1)[-1]

    if file_type == 'png' or file_type == 'jpg' or file_type == 'jpeg' or file_type == 'gif':
        updir = os.path.join(os.getcwd(), 'static\\images\\upload\\')

        new_picture = Picture(picture_name=filename, user_id=user_id)
        arch_db.session.add(new_picture)
        arch_db.session.commit()
    else:
        updir = os.path.join(os.getcwd(), 'static\\docs\\upload\\')

        new_document = Document(document_name=filename, user_id=user_id)
        arch_db.session.add(new_document)
        arch_db.session.commit()

    file.save(os.path.join(updir, filename))

    flash("You will receive an email once you have been given access to login.")
    return redirect(url_for('auth.login'))


@auth.route('/logout')
@login_required
def logout():
    logout_user()

    flash("Successfully logged out.")
    return redirect(url_for('auth.login'))
