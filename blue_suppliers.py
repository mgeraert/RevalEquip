import csv
import json

import flask_login
from flask import Blueprint, render_template, request, Response
from flask_login import login_required
from werkzeug.utils import redirect

from classes.Database import Database

suppliers = Blueprint('suppliers', __name__)


@suppliers.route('/suppliers/', methods=['GET'])
@login_required
def _suppliers():
    user = flask_login.current_user
    if user.is_admin():
        return render_template('suppliers.html')
    else:
        db = Database()
        db.conn.row_factory = db.dict_factory
        c = db.conn.cursor()

        user = flask_login.current_user

        sql_find_owner = 'SELECT ID, equipment_supplier_id FROM equipment WHERE equipment_owner_id = "' + str(
            user.get_id()) + '"'
        c.execute(sql_find_owner)
        owner = c.fetchall()
        sql_find_co_owner = 'SELECT ID, equipment_supplier_id FROM equipment WHERE equipment_co_owner_id = "' + str(
            user.get_id()) + '"'
        c.execute(sql_find_co_owner)
        co_owner = c.fetchall()

        equipment = owner + co_owner

        if not equipment:
            return redirect(request.referrer)
        else:
            return render_template('suppliers.html')


@suppliers.route('/suppliers/get')
@login_required
def get_suppliers():
    db = Database()
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()

    user = flask_login.current_user

    # admin is allowed to receive all the data
    if user.is_admin():
        sql_string = 'SELECT * FROM suppliers '
        c.execute(sql_string)
        data = c.fetchall()
    # the rest is only allowed to see the insensitive data
    else:
        user = flask_login.current_user

        sql_find_owner = 'SELECT ID, equipment_supplier_id FROM equipment WHERE equipment_owner_id = "' + str(
            user.get_id()) + '"'
        c.execute(sql_find_owner)
        owner = c.fetchall()
        sql_find_co_owner = 'SELECT ID, equipment_supplier_id FROM equipment WHERE equipment_co_owner_id = "' + str(
            user.get_id()) + '"'
        c.execute(sql_find_co_owner)
        co_owner = c.fetchall()

        equipment = owner + co_owner

        if not equipment:
            data = []
        else:
            data = []
            for equip in equipment:
                sql_string = 'SELECT * FROM suppliers WHERE ID ="' + str(equip['equipment_supplier_id']) + '"'
                c.execute(sql_string)
                data = data + c.fetchall()

    c.close()
    return json.dumps(data)


@suppliers.route('/suppliers/update', methods=['GET'])
@login_required
def update_user():
    db = Database()
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()

    user = flask_login.current_user

    sql_find_owner = 'SELECT ID, equipment_supplier_id FROM equipment WHERE equipment_owner_id = "' + str(
    user.get_id()) + '"'
    c.execute(sql_find_owner)
    owner = c.fetchall()
    sql_find_co_owner = 'SELECT ID, equipment_supplier_id FROM equipment WHERE equipment_co_owner_id = "' + str(
    user.get_id()) + '"'
    c.execute(sql_find_co_owner)
    co_owner = c.fetchall()

    equipment = owner + co_owner

    # only admin is allowed to update a supplier
    # owner of equipment is also allowed to change the supplier to this equipment
    if not user.is_admin() and not equipment:
        return 'http403'

    sql_string = 'UPDATE suppliers SET '
    sql_parameters = ''
    ID = request.args.get('ID')

    supplier_last_name = request.args.get('supplier_last_name')
    if supplier_last_name != '':
        sql_parameters = sql_parameters + 'supplier_last_name="' + supplier_last_name + '"'
    else:
        return 'http400'

    supplier_name = request.args.get('supplier_name')
    if supplier_name != '':
        sql_parameters = sql_parameters + ',supplier_name="' + supplier_name + '"'
    else:
        return 'http400'

    supplier_email = request.args.get('supplier_email')
    if supplier_email != '':
        sql_parameters = sql_parameters + ',supplier_email="' + supplier_email + '"'
    else:
        return 'http400'

    supplier_phone = request.args.get('supplier_phone')
    if supplier_phone != '':
        sql_parameters = sql_parameters + ',supplier_phone="' + supplier_phone + '"'
    else:
        return 'http400'

    supplier_company = request.args.get('supplier_company')
    if supplier_company != '':
        sql_parameters = sql_parameters + ',supplier_company="' + supplier_company + '"'

    supplier_comment = request.args.get('supplier_comment')
    if supplier_comment != '':
        sql_parameters = sql_parameters + ',supplier_comment="' + supplier_comment + '"'

    db = Database()

    if sql_parameters[0] == ',':
        sql_parameters = sql_parameters[1:]
    sql_string = sql_string + sql_parameters + ' WHERE ID = ' + ID

    print(sql_string)

    c = db.conn.cursor()
    c.execute(sql_string)
    db.conn.commit()

    c.close()
    return 'http200'


@suppliers.route('/suppliers/new', methods=['GET'])
@login_required
def new_user():
    user = flask_login.current_user
    # only admin is allowed to create a supplier
    if not user.is_admin():
        return 'http403'

    sql_string = 'INSERT INTO suppliers '
    sql_parameters = '('
    sql_values = '('

    supplier_last_name = request.args.get('supplier_last_name').upper()
    if supplier_last_name != '':
        sql_parameters = sql_parameters + 'supplier_last_name,'
        sql_values = sql_values + '"' + supplier_last_name + '",'
    else:
        return 'http400'

    supplier_name = request.args.get('supplier_name').title()
    if supplier_name != '':
        sql_parameters = sql_parameters + 'supplier_name,'
        sql_values = sql_values + '"' + supplier_name + '",'
    else:
        return 'http400'

    supplier_email = request.args.get('supplier_email')
    if supplier_email != '':
        sql_parameters = sql_parameters + 'supplier_email,'
        sql_values = sql_values + '"' + supplier_email + '",'
    else:
        return 'http400'

    supplier_phone = request.args.get('supplier_phone')
    if supplier_phone != '':
        sql_parameters = sql_parameters + 'supplier_phone,'
        sql_values = sql_values + '"' + supplier_phone + '",'
    else:
        return 'http400'

    supplier_company = request.args.get('supplier_company')
    if supplier_company != '':
        sql_parameters = sql_parameters + 'supplier_company,'
        sql_values = sql_values + '"' + supplier_company + '",'

    supplier_comment = request.args.get('supplier_comment')
    if supplier_comment != '':
        sql_parameters = sql_parameters + 'supplier_comment,'
        sql_values = sql_values + '"' + supplier_comment + '",'

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


@suppliers.route('/suppliers/delete', methods=['GET'])
@login_required
def delete_user():
    user = flask_login.current_user
    # only admin is allowed to delete a supplier
    if not user.is_admin():
        return 'http403'

    db = Database()
    ID = request.args.get('ID')

    sql = 'DELETE FROM suppliers WHERE ID = "' + ID + '"'
    print(sql)
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()
    c.execute(sql)
    db.conn.commit()

    c.close()
    return 'http200'


@suppliers.route('/suppliers/download-as-csv')
@login_required
def download_suppliers_as_csv():
    db = Database()
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()
    sql_string = 'SELECT * FROM suppliers'
    c.execute(sql_string)
    data = c.fetchall()
    print(data)
    c.close()

    data_file = open('data_suppliers.csv', 'w', encoding="utf-8", newline='')
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

    with open("data_suppliers.csv") as fp:
        csv_file = fp.read()

    user = flask_login.current_user

    # admin is allowed to receive all the data
    if user.is_admin():
        return Response(csv_file, mimetype="text/csv",
                        headers={"Content-disposition": "attachment; filename=data_suppliers.csv"})
    else:
        return redirect(request.referrer)


@suppliers.route('/suppliers/get-name-by-id', methods=['GET'])
@login_required
def get_supplier_name_by_id():
    db = Database()
    supplier_id = request.args.get('ID')

    sql = 'SELECT ID, supplier_last_name, supplier_name FROM suppliers WHERE ID = "' + supplier_id + '"'
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()
    c.execute(sql)
    return json.dumps(c.fetchall())


@suppliers.route('/suppliers/get-pop-up-info-by-id', methods=['GET'])
@login_required
def get_supplier_pop_up_info_by_id():
    db = Database()
    supplier_id = request.args.get('ID')

    sql = 'SELECT ID, supplier_last_name, supplier_name, supplier_email, supplier_phone, supplier_comment FROM ' \
          'suppliers WHERE ID = "' + supplier_id + '" '
    print(sql)
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()
    c.execute(sql)
    return json.dumps(c.fetchall())


@suppliers.route('/suppliers/get-supplier-suggestion-by-name', methods=['GET'])
@login_required
def get_supplier_suggestion_by_name():
    db = Database()
    name = request.args.get('name')

    sql_string_last_name = 'SELECT ID, supplier_last_name, supplier_name FROM suppliers WHERE supplier_last_name ' \
                           'LIKE "%' + name + '%" '
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()
    c.execute(sql_string_last_name)
    data_last_name = c.fetchall()

    sql_string_first_name = 'SELECT ID, supplier_last_name, supplier_name FROM suppliers WHERE supplier_name LIKE "%' + name + '%"'
    c.execute(sql_string_first_name)
    data_first_name = c.fetchall()

    list_of_all_names = data_first_name + data_last_name

    unique_suppliers = []
    for x in list_of_all_names:
        if x not in unique_suppliers:
            unique_suppliers.append(x)

    c.close()
    return json.dumps(unique_suppliers)
