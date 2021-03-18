import login as login
import sqlalchemy as sqlalchemy
from flask import Flask, Flask, request, render_template, send_from_directory, url_for, jsonify, flash
from flask_login import login_user, logout_user, login_required, current_user, LoginManager
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash

from classes.Database import Database
from werkzeug.utils import secure_filename, redirect

import sys
import glob
import json
import fnmatch
import platform
import os
import re

from blue_suppliers import suppliers
from blue_users import users
from blue_equipment import equipment
from user import User

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///revalEquip.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

app.register_blueprint(suppliers)
app.register_blueprint(users)
app.register_blueprint(equipment)

basedir = os.path.abspath(os.path.dirname(__file__))

# db = Database()
# db.create_db()

from logging import Formatter, FileHandler

handler = FileHandler(os.path.join(basedir, 'log.txt'), encoding='utf8')
handler.setFormatter(
    Formatter("[%(asctime)s] %(levelname)-8s %(message)s", "%Y-%m-%d %H:%M:%S")
)
app.logger.addHandler(handler)

app.config['ALLOWED_EXTENSIONS'] = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
app.config['SECRET_KEY'] = 'wwzzxxsecretekeytodatabase'


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in app.config['ALLOWED_EXTENSIONS']


@app.route("/hello")
def beneden():
    return 'Hi'


@app.route("/test")
def test():
    return render_template('test.html')


@app.route("/menu")
def menu():
    return render_template('menu.html')


@app.route("/login")
def login():
    return render_template("login.html")


@app.route("/login", methods=['POST'])
def login_post():
    db = Database()
    c = db.conn.cursor()

    email = request.form.get('login_email')
    password = request.form.get('login_password')

    sql_search_for_email = 'SELECT * FROM users WHERE user_email="' + email + '"'
    print(sql_search_for_email)
    c.execute(sql_search_for_email)
    data_search_email = c.fetchall()
    if not data_search_email:
        print("Deze email is niet geregistreerd")
        return redirect(url_for('login'))  # if user doesn't exist or password is wrong, reload the page

    # if the above check passes, then we know the user has the right credentials
    # login_user(user)
    return redirect(url_for('equipment'))


@app.route("/register", methods=['GET'])
def register():
    return render_template("register.html")


@app.route("/register", methods=['POST'])
def register_post():
    name = request.form.get('register_name').title()
    last_name = request.form.get('register_last_name').upper()
    email = request.form.get('register_email')
    password = request.form.get('register_pw_hash')

    # db = Database()
    # c = db.conn.cursor()
    #
    # sql_string = 'INSERT INTO users '
    # sql_parameters = '('
    # sql_values = '('
    #
    # if name != '':
    #     sql_parameters = sql_parameters + 'user_name,'
    #     sql_values = sql_values + '"' + name + '",'
    # else:
    #     flash("Gelieve alle velden in te vullen")
    #     return redirect(url_for('register'))
    #
    # if last_name != '':
    #     sql_parameters = sql_parameters + 'user_last_name,'
    #     sql_values = sql_values + '"' + last_name + '",'
    # else:
    #     flash("Gelieve alle velden in te vullen")
    #     return redirect(url_for('register'))
    #
    # sql_search_for_name = 'SELECT * FROM users WHERE user_last_name="' + last_name + '" AND user_name="' + name + '"'
    # print(sql_search_for_name)
    # c.execute(sql_search_for_name)
    # data_search_name = c.fetchall()
    # if data_search_name:
    #     print("Deze naam staat al in de database")
    #     flash("Deze naam staat al in de database")
    #     return redirect(url_for('register'))
    #
    # if email != '':
    #     regex = '^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$'
    #     if re.search(regex, email):
    #         sql_parameters = sql_parameters + 'user_email,'
    #         sql_values = sql_values + '"' + email + '",'
    #     else:
    #         flash("Gelieve een geldige email in te geven")
    #         return redirect(url_for('register'))
    # else:
    #     flash("Gelieve alle velden in te vullen")
    #     return redirect(url_for('register'))
    #
    # sql_search_for_email = 'SELECT * FROM users WHERE user_email="' + email + '"'
    # print(sql_search_for_email)
    # c.execute(sql_search_for_email)
    # data_search_email = c.fetchall()
    # if data_search_email:
    #     print("Deze email is al in gebruik")
    #     flash("Deze email is al in gebruik")
    #     return redirect(url_for('register'))
    #
    # if password != '':
    #     sql_parameters = sql_parameters + 'user_pw_hash,'
    #     sql_values = sql_values + '"' + password + '",'
    # else:
    #     flash("Gelieve alle velden in te vullen")
    #     return redirect(url_for('register'))
    #
    # if sql_parameters[len(sql_parameters) - 1] == ',':
    #     sql_parameters = sql_parameters[:len(sql_parameters) - 1] + sql_parameters[(len(sql_parameters) - 1 + 1):]
    # if sql_values[len(sql_values) - 1] == ',':
    #     sql_values = sql_values[:len(sql_values) - 1] + sql_values[(len(sql_values) - 1 + 1):]
    # sql_string = sql_string + sql_parameters + ') VALUES ' + sql_values + ')'
    #
    # print(sql_string)
    #
    # if sql_string[sql_string.find("(") + 1:sql_string.find(")")] == "":
    #     return redirect(url_for('register'))
    #
    # c.execute(sql_string)
    # db.conn.commit()
    #
    # c.close()

    new_user = User(user_last_name=last_name, user_name=name, user_email=email, user_pw_hash=password)
    arch_db = SQLAlchemy()
    print(new_user)
    arch_db.session.add(new_user)
    arch_db.session.commit()

    return redirect(url_for('login'))


@app.route('/uploadajax_eq', methods=['GET', 'POST'])
def upldfile_eq():
    equipment_id = request.args.get('equipment_id')
    if request.method == 'POST':
        files = request.files['file']
        if files and allowed_file(files.filename):
            filename = equipment_id + '-1' + secure_filename(files.filename)
            app.logger.info('FileName: ' + filename)
            updir = os.path.join(basedir, 'static\\images\\upload\\')
            files.save(os.path.join(updir, filename))
            file_size = os.path.getsize(os.path.join(updir, filename))
            return jsonify(name=filename, size=file_size)


@app.route('/uploadajax_user', methods=['GET', 'POST'])
def upldfile_user():
    user_id = request.args.get('user_id')
    if request.method == 'POST':
        files = request.files['file']
        if files and allowed_file(files.filename):
            filename = '-1' + user_id + secure_filename(files.filename)
            app.logger.info('FileName: ' + filename)
            updir = os.path.join(basedir, 'static\\images\\upload\\')
            files.save(os.path.join(updir, filename))
            file_size = os.path.getsize(os.path.join(updir, filename))
            return jsonify(name=filename, size=file_size)


@app.route('/get_files', methods=['GET'])
def get_files_from_directory():
    directory = request.args.get('directory')
    equipmentID = request.args.get('equipmentID')
    userID = request.args.get('userID')

    updir = os.path.join(basedir, directory)
    files = os.listdir(updir)
    images = []
    if (userID == '-1'):
        for file in files:
            if fnmatch.fnmatch(file, equipmentID + "-1*"):
                images.append(file)
    else:
        for file in files:
            if fnmatch.fnmatch(file, "-1" + userID + "*"):
                images.append(file)
    return json.dumps(images)


if __name__ == '__main__':
    # app.run(debug=True, use_reloader=True)
    app.run(host="0.0.0.0", port="5000")
