from flask import Blueprint, request, render_template
from classes.Database import Database
import json

users = Blueprint('users', __name__)


@users.route('/users', methods=['GET'])
def reval_users():
    return render_template('users.html')


@users.route('/getUsers', methods=['GET'])
def get_users():
    db = Database()
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()
    sql_string = 'SELECT * FROM users'
    c.execute(sql_string)
    data = c.fetchall()

    c.close()
    return json.dumps(data)

@users.route('/updateUser', methods=['GET'])
def update_user():
    sql_string = 'UPDATE users SET '
    sql_parameters = ''
    ID = request.args.get('ID')

    user_last_name = request.args.get('user_last_name')
    if user_last_name != '':
        sql_parameters = sql_parameters + 'user_last_name="' + user_last_name + '"'
    else:
        return 'http400'

    user_name = request.args.get('user_name')
    if user_name != '':
        sql_parameters = sql_parameters + ',user_name="' + user_name + '"'
    else:
        return 'http400'

    user_sex = request.args.get('user_sex')
    if user_sex != '':
        sql_parameters = sql_parameters + ',user_sex="' + user_sex + '"'

    user_is_pi = request.args.get('user_is_pi')
    if user_is_pi != '':
        sql_parameters = sql_parameters + ',user_is_pi="' + user_is_pi + '"'

    user_is_phd = request.args.get('user_is_phd')
    if user_is_phd != '':
        sql_parameters = sql_parameters + ',user_is_phd="' + user_is_phd + '"'

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

    user_home_address = request.args.get('user_home_address')
    if user_home_address != '':
        sql_parameters = sql_parameters + ',user_home_address="' + user_home_address + '"'

    user_telephone = request.args.get('user_telephone')
    if user_telephone != '':
        sql_parameters = sql_parameters + ',user_telephone="' + user_telephone + '"'

    user_private_phone = request.args.get('user_private_phone')
    if user_private_phone != '':
        sql_parameters = sql_parameters + ',user_private_phone="' + user_private_phone + '"'

    user_in_date = request.args.get('user_in_date')
    if user_in_date != '':
        sql_parameters = sql_parameters + ',user_in_date="' + user_in_date + '"'

    user_out_date = request.args.get('user_out_date')
    if user_out_date != '':
        sql_parameters = sql_parameters + ',user_out_date="' + user_out_date + '"'

    user_pw_hash = request.args.get('user_pw_hash')
    if user_pw_hash != '':
        sql_parameters = sql_parameters + ',user_pw_hash="' + user_pw_hash + '"'

    user_alternative_ID = request.args.get('user_alternative_ID')
    if user_alternative_ID != '':
        sql_parameters = sql_parameters + ',user_alternative_ID="' + user_alternative_ID + '"'

    db = Database()
    print(sql_parameters)

    if sql_parameters[0] == ',':
        sql_parameters = sql_parameters[1:]
    sql_string = sql_string + sql_parameters + ' WHERE ID = ' + ID
    print(sql_string)

    c = db.conn.cursor()
    c.execute(sql_string)
    db.conn.commit()

    c.close()
    return 'http200'

@users.route('/newUser', methods=['GET'])
def new_user():
    sql_string = 'INSERT INTO users '
    sql_parameters = '('
    sql_values = '('

    user_last_name = request.args.get('user_last_name')
    if user_last_name != '':
        sql_parameters = sql_parameters + 'user_last_name,'
        sql_values = sql_values + '"' + user_last_name + '",'
    else:
        return 'http400'

    user_name = request.args.get('user_name')
    if user_name != '':
        sql_parameters = sql_parameters + 'user_name,'
        sql_values = sql_values + '"' + user_name + '",'
    else:
        return 'http400'

    user_sex = request.args.get('user_sex')
    if user_sex != '':
        sql_parameters = sql_parameters + 'user_sex,'
        sql_values = sql_values + '"' + user_sex + '",'

    user_is_pi = request.args.get('user_is_pi')
    if user_is_pi != '':
        sql_parameters = sql_parameters + 'user_is_pi,'
        sql_values = sql_values + '"' + user_is_pi + '",'

    user_is_phd = request.args.get('user_is_phd')
    if user_is_phd != '':
        sql_parameters = sql_parameters + 'user_is_phd,'
        sql_values = sql_values + '"' + user_is_phd + '",'

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

    user_home_address = request.args.get('user_home_address')
    if user_home_address != '':
        sql_parameters = sql_parameters + 'user_home_address,'
        sql_values = sql_values + '"' + user_home_address + '",'

    user_telephone = request.args.get('user_telephone')
    if user_telephone != '':
        sql_parameters = sql_parameters + 'user_telephone,'
        sql_values = sql_values + '"' + user_telephone + '",'

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

    user_pw_hash = request.args.get('user_pw_hash')
    if user_pw_hash != '':
        sql_parameters = sql_parameters + 'user_pw_hash,'
        sql_values = sql_values + '"' + user_pw_hash + '",'

    user_alternative_ID = request.args.get('user_alternative_ID')
    if user_alternative_ID != '':
        sql_parameters = sql_parameters + 'user_alternative_ID,'
        sql_values = sql_values + '"' + user_alternative_ID + '",'

    db = Database()

    if sql_parameters[len(sql_parameters)-1] == ',':
        sql_parameters = sql_parameters[:len(sql_parameters)-1] + sql_parameters[(len(sql_parameters)-1+1):]
    if sql_values[len(sql_values)-1] == ',':
        sql_values = sql_values[:len(sql_values)-1] + sql_values[(len(sql_values)-1+1):]

    sql_string = sql_string + sql_parameters + ') VALUES ' + sql_values + ')'
    print(sql_string)

    c = db.conn.cursor()
    c.execute(sql_string)
    db.conn.commit()

    c.close()
    return 'http200'

@users.route('/deleteUser', methods=['GET'])
def delete_user():
    db = Database()
    ID = request.args.get('ID')

    sql = 'DELETE FROM users WHERE ID = "'+ID+'"'
    print(sql)
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()
    c.execute(sql)
    db.conn.commit()

    c.close()
    return 'http200'
