import csv
import json
import os

import flask_login
from flask import Blueprint, render_template, request, Response
from flask_login import login_required
from werkzeug.utils import redirect

from classes.Database import Database

users = Blueprint('users', __name__)


@users.route('/users/', methods=['GET'])
@login_required
def _users():
    user = flask_login.current_user
    if user.is_admin():
        return render_template('users.html')
    else:
        return redirect(request.referrer)


@users.route('/users/get')
@login_required
def get_users():
    db = Database()
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()

    user = flask_login.current_user

    # admin is allowed to receive all the data
    if user.is_admin():
        sql_string = 'SELECT * FROM users '
        c.execute(sql_string)
        data = c.fetchall()
    # the rest is only allowed to see the insensitive data
    else:
        data = []

    c.close()
    return json.dumps(data)


@users.route('/users/update', methods=['GET'])
@login_required
def update_user():
    user = flask_login.current_user
    # only admin is allowed to update a user in the user table
    if not user.is_admin():
        return 'http403'

    sql_string = 'UPDATE users SET '
    sql_parameters = ''
    ID = request.args.get('ID')

    user_last_name = request.args.get('user_last_name').upper()
    if user_last_name != '':
        sql_parameters = sql_parameters + 'user_last_name="' + user_last_name + '"'
    else:
        return 'http400'

    user_name = request.args.get('user_name').title()
    if user_name != '':
        sql_parameters = sql_parameters + ',user_name="' + user_name + '"'
    else:
        return 'http400'

    user_sex = request.args.get('user_sex')
    if user_sex != '':
        sql_parameters = sql_parameters + ',user_sex="' + user_sex + '"'

    user_title = request.args.get('user_title')
    if user_title != '':
        sql_parameters = sql_parameters + ',user_title="' + user_title + '"'

    user_category = request.args.get('user_category')
    if user_category != '':
        sql_parameters = sql_parameters + ',user_category="' + user_category + '"'

    user_function = request.args.get('user_function')
    if user_function != '':
        sql_parameters = sql_parameters + ',user_function="' + user_function + '"'

    user_email = request.args.get('user_email')
    if user_email != '':
        sql_parameters = sql_parameters + ',user_email="' + user_email + '"'
    else:
        return 'http400'

    user_home_address = request.args.get('user_home_address')
    if user_home_address != '':
        sql_parameters = sql_parameters + ',user_home_address="' + user_home_address + '"'

    user_telephone = request.args.get('user_telephone')
    if user_telephone != '':
        sql_parameters = sql_parameters + ',user_telephone="' + user_telephone + '"'
    else:
        return 'http400'

    user_private_phone = request.args.get('user_private_phone')
    if user_private_phone != '':
        sql_parameters = sql_parameters + ',user_private_phone="' + user_private_phone + '"'

    user_in_date = request.args.get('user_in_date')
    if user_in_date != '':
        sql_parameters = sql_parameters + ',user_in_date="' + user_in_date + '"'

    user_out_date = request.args.get('user_out_date')
    if user_out_date != '':
        sql_parameters = sql_parameters + ',user_out_date="' + user_out_date + '"'

    user_is_pi = request.args.get('user_is_pi')
    if user_is_pi != '':
        sql_parameters = sql_parameters + ',user_is_pi="' + user_is_pi + '"'

    user_is_phd = request.args.get('user_is_phd')
    if user_is_phd != '':
        sql_parameters = sql_parameters + ',user_is_phd="' + user_is_phd + '"'

    user_is_financial_team = request.args.get('user_is_financial_team')
    if user_is_financial_team != '':
        sql_parameters = sql_parameters + ',user_is_financial_team="' + user_is_financial_team + '"'

    user_is_admin = request.args.get('user_is_admin')
    if user_is_admin != '':
        sql_parameters = sql_parameters + ',user_is_admin="' + user_is_admin + '"'

    user_is_lender = request.args.get('user_is_lender')
    if user_is_lender != '':
        sql_parameters = sql_parameters + ',user_is_lender="' + user_is_lender + '"'

    user_is_lender_admin = request.args.get('user_is_lender_admin')
    if user_is_lender_admin != '':
        sql_parameters = sql_parameters + ',user_is_lender_admin="' + user_is_lender_admin + '"'

    user_is_owner = request.args.get('user_is_owner')
    if user_is_owner != '':
        sql_parameters = sql_parameters + ',user_is_owner="' + user_is_owner + '"'

    db = Database()

    if sql_parameters[0] == ',':
        sql_parameters = sql_parameters[1:]
    sql_string = sql_string + sql_parameters + ' WHERE ID = ' + ID

    c = db.conn.cursor()
    c.execute(sql_string)
    db.conn.commit()

    c.close()
    return 'http200'


@users.route('/users/new', methods=['GET'])
@login_required
def new_user():
    user = flask_login.current_user
    # only admin is allowed to create a new user in the user table
    if not user.is_admin():
        return 'http403'

    sql_string = 'INSERT INTO users '
    sql_parameters = '('
    sql_values = '('

    user_last_name = request.args.get('user_last_name').upper()
    if user_last_name != '':
        sql_parameters = sql_parameters + 'user_last_name,'
        sql_values = sql_values + '"' + user_last_name + '",'
    else:
        return 'http400'

    user_name = request.args.get('user_name').title()
    if user_name != '':
        sql_parameters = sql_parameters + 'user_name,'
        sql_values = sql_values + '"' + user_name + '",'
    else:
        return 'http400'

    user_sex = request.args.get('user_sex')
    if user_sex != '':
        sql_parameters = sql_parameters + 'user_sex,'
        sql_values = sql_values + '"' + user_sex + '",'

    user_title = request.args.get('user_title')
    if user_title != '':
        sql_parameters = sql_parameters + 'user_title,'
        sql_values = sql_values + '"' + user_title + '",'

    user_category = request.args.get('user_category')
    if user_category != '':
        sql_parameters = sql_parameters + 'user_category,'
        sql_values = sql_values + '"' + user_category + '",'

    user_function = request.args.get('user_function')
    if user_function != '':
        sql_parameters = sql_parameters + 'user_function,'
        sql_values = sql_values + '"' + user_function + '",'

    user_email = request.args.get('user_email')
    if user_email != '':
        sql_parameters = sql_parameters + 'user_email,'
        sql_values = sql_values + '"' + user_email + '",'
    else:
        return 'http400'

    user_home_address = request.args.get('user_home_address')
    if user_home_address != '':
        sql_parameters = sql_parameters + 'user_home_address,'
        sql_values = sql_values + '"' + user_home_address + '",'

    user_telephone = request.args.get('user_telephone')
    if user_telephone != '':
        sql_parameters = sql_parameters + 'user_telephone,'
        sql_values = sql_values + '"' + user_telephone + '",'
    else:
        return 'http400'

    user_private_phone = request.args.get('user_private_phone')
    if user_private_phone != '':
        sql_parameters = sql_parameters + 'user_private_phone,'
        sql_values = sql_values + '"' + user_private_phone + '",'

    user_in_date = request.args.get('user_in_date')
    if user_in_date != '':
        sql_parameters = sql_parameters + 'user_in_date,'
        sql_values = sql_values + '"' + user_in_date + '",'

    user_out_date = request.args.get('user_out_date')
    if user_out_date != '':
        sql_parameters = sql_parameters + 'user_out_date,'
        sql_values = sql_values + '"' + user_out_date + '",'

    user_is_pi = request.args.get('user_is_pi')
    if user_is_pi != '':
        sql_parameters = sql_parameters + 'user_is_pi,'
        sql_values = sql_values + '"' + user_is_pi + '",'

    user_is_phd = request.args.get('user_is_phd')
    if user_is_phd != '':
        sql_parameters = sql_parameters + 'user_is_phd,'
        sql_values = sql_values + '"' + user_is_phd + '",'

    user_is_financial_team = request.args.get('user_is_financial_team')
    if user_is_financial_team != '':
        sql_parameters = sql_parameters + 'user_is_financial_team,'
        sql_values = sql_values + '"' + user_is_financial_team + '",'

    user_is_admin = request.args.get('user_is_admin')
    if user_is_admin != '':
        sql_parameters = sql_parameters + 'user_is_admin,'
        sql_values = sql_values + '"' + user_is_admin + '",'

    user_is_lender = request.args.get('user_is_lender')
    if user_is_lender != '':
        sql_parameters = sql_parameters + 'user_is_lender,'
        sql_values = sql_values + '"' + user_is_lender + '",'

    user_is_lender_admin = request.args.get('user_is_lender_admin')
    if user_is_lender_admin != '':
        sql_parameters = sql_parameters + 'user_is_lender_admin,'
        sql_values = sql_values + '"' + user_is_lender_admin + '",'

    user_is_owner = request.args.get('user_is_owner')
    if user_is_owner != '':
        sql_parameters = sql_parameters + 'user_is_owner,'
        sql_values = sql_values + '"' + user_is_owner + '",'

    db = Database()

    if sql_parameters[len(sql_parameters) - 1] == ',':
        sql_parameters = sql_parameters[:len(sql_parameters) - 1] + sql_parameters[(len(sql_parameters) - 1 + 1):]
    if sql_values[len(sql_values) - 1] == ',':
        sql_values = sql_values[:len(sql_values) - 1] + sql_values[(len(sql_values) - 1 + 1):]

    sql_string = sql_string + sql_parameters + ') VALUES ' + sql_values + ')'
    print(sql_string)

    c = db.conn.cursor()
    c.execute(sql_string)
    db.conn.commit()

    c.close()
    return 'http200'


@users.route('/users/delete', methods=['GET'])
@login_required
def delete_user():
    user = flask_login.current_user
    # only admin is allowed to delete a user in the user table
    if not user.is_admin():
        return 'http403'

    db = Database()
    ID = request.args.get('ID')

    sql1 = 'DELETE FROM users WHERE ID = "' + ID + '"'
    sql2 = 'DELETE FROM pictures WHERE user_id = "' + ID + '"'

    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()
    c.execute(sql1)
    c.execute(sql2)
    db.conn.commit()

    pictures_dir = os.path.join(os.getcwd(), 'static\\images\\upload\\')
    for filename in os.listdir(pictures_dir):
        if filename.startswith("user_profile_picture_id_" + ID) or filename.startswith("user_register_upload_id_" + ID):
            os.remove(os.path.join(pictures_dir, filename))

    c.close()
    return 'http200'


@users.route('/users/download-as-csv')
@login_required
def download_users_as_csv():
    db = Database()
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()
    sql_string = 'SELECT * FROM users'
    c.execute(sql_string)
    data = c.fetchall()
    c.close()

    data_file = open('data_users.csv', 'w', encoding="utf-8", newline='')
    csv_writer = csv.writer(data_file, delimiter=';')

    count = 0
    for eq in data:
        if count == 0:
            # Writing headers of CSV file
            header = eq.keys()
            csv_writer.writerow(header)
            count += 1
        # Writing data of CSV file
        csv_writer.writerow(eq.values())

    with open("data_users.csv") as fp:
        csv_file = fp.read()

    user = flask_login.current_user

    # admin is allowed to receive all the data
    if user.is_admin():
        return Response(csv_file, mimetype="text/csv",
                        headers={"Content-disposition": "attachment; filename=data_users.csv"})
    else:
        return redirect(request.referrer)


@users.route('/users/get-logged-in-users-data')
@login_required
def get_logged_in_users_data():
    db = Database()

    user_id = flask_login.current_user.get_id()

    sql = 'SELECT ID, user_name, user_last_name, user_category, user_function, user_sex, user_email, user_telephone, ' \
          'user_title, user_home_address, user_private_phone, user_is_pi, user_is_phd, user_in_date, user_out_date ' \
          'FROM users WHERE ID = "' + str(user_id) + '" '
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()
    c.execute(sql)
    return json.dumps(c.fetchall())


@users.route('/users/get-by-id', methods=['GET'])
@login_required
def get_user_by_id():
    db = Database()
    user_id = request.args.get('ID')

    sql = 'SELECT * FROM users WHERE ID = "' + user_id + '"'
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()
    c.execute(sql)
    return json.dumps(c.fetchall())


@users.route('/users/get-name-by-id', methods=['GET'])
@login_required
def get_user_name_by_id():
    db = Database()
    user_id = request.args.get('ID')

    sql = 'SELECT ID, user_last_name, user_name FROM users WHERE ID = "' + user_id + '"'
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()
    c.execute(sql)
    return json.dumps(c.fetchall())


@users.route('/users/get-pop-up-info-by-id', methods=['GET'])
@login_required
def get_user_pop_up_info_by_id():
    db = Database()
    user_id = request.args.get('ID')

    sql = 'SELECT ID, user_last_name, user_name, user_email, user_telephone FROM users WHERE ID = "' + user_id + '"'
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()
    c.execute(sql)
    return json.dumps(c.fetchall())


@users.route('/users/get-permissions-by-id', methods=['GET'])
@login_required
def get_user_permissions_by_id():
    db = Database()
    user_id = request.args.get('ID')

    sql = 'SELECT ID, user_can_see_financial_data, user_is_admin, user_is_lender, user_is_lender_admin, ' \
          'user_is_owner FROM users WHERE ID = "' + user_id + '" '
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()
    c.execute(sql)
    return json.dumps(c.fetchall())


@users.route('/users/get-by-access', methods=['GET'])
@login_required
def get_user_by_access():
    db = Database()
    access = request.args.get('access')

    sql = 'SELECT ID, user_name, user_last_name, user_email FROM users WHERE user_is_allowed = "' + access + '"'
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()
    c.execute(sql)
    return json.dumps(c.fetchall())


@users.route('/users/get-owner-suggestion-by-name', methods=['GET'])
@login_required
def get_owner_suggestion_by_name():
    db = Database()
    name = request.args.get('name')

    sql_string_last_name = 'SELECT ID, user_last_name, user_name FROM users WHERE user_last_name LIKE "%' + name + '%"'
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()
    c.execute(sql_string_last_name)
    data_last_name = c.fetchall()

    sql_string_first_name = 'SELECT ID, user_last_name, user_name FROM users WHERE user_name LIKE "%' + name + '%"'
    c.execute(sql_string_first_name)
    data_first_name = c.fetchall()

    list_of_all_names = data_first_name + data_last_name

    unique_users = []
    for x in list_of_all_names:
        if x not in unique_users:
            unique_users.append(x)

    c.close()
    return json.dumps(unique_users)
