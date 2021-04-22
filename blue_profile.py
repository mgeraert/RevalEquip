import flask_login
from flask import Blueprint, render_template, request, flash
from flask_login import login_required

from classes.Database import Database

profile = Blueprint('profile', __name__)


@profile.route('/profile/', methods=['GET'])
@login_required
def _profile():
    return render_template('profile.html')


@profile.route('/profile/update', methods=['GET'])
@login_required
def update_profile():
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

    if user_last_name != '' and user_name != '' and user_email != '' and user_telephone != '':
        sql_parameters = sql_parameters + ',user_completed_profile="1"'

    db = Database()

    if sql_parameters[0] == ',':
        sql_parameters = sql_parameters[1:]
    sql_string = sql_string + sql_parameters + ' WHERE ID = ' + ID

    c = db.conn.cursor()
    c.execute(sql_string)
    db.conn.commit()

    c.close()
    flash('Profile updated')
    return 'http200'
