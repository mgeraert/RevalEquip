import csv
import json
import os

import flask_login
from flask import Blueprint, render_template, Response, request
from flask_login import login_required
from werkzeug.utils import redirect

from classes.Database import Database

equipment = Blueprint('equipment', __name__)


@equipment.route('/equipment')
@login_required
def _equipment():
    return render_template('equipment.html')


@equipment.route('/equipment/get')
@login_required
def get_equipment():
    db = Database()
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()

    user = flask_login.current_user

    # admin is allowed to receive all the data
    if user.is_admin():
        sql_string = 'SELECT * FROM equipment '
        c.execute(sql_string)
        data = c.fetchall()
    # financial team is allowed to see all the insensitive data and financial data
    elif user.is_financial_team():
        sql_string = 'SELECT * FROM equipment '
        c.execute(sql_string)
        data = c.fetchall()
    # the rest is only allowed to see the insensitive data
    else:
        sql_string = 'SELECT ID, equipment_inventory_number, equipment_label, equipment_name, equipment_amount, ' \
                     'equipment_description, equipment_outcome, equipment_purchase_date, equipment_base_location, ' \
                     'equipment_is_mobile, equipment_owner_id, equipment_co_owner_id, equipment_supplier_id, ' \
                     'equipment_bookable FROM equipment '
        c.execute(sql_string)
        data = c.fetchall()

    c.close()
    return json.dumps(data)


@equipment.route('/equipment/get-by-id', methods=['GET'])
@login_required
def get_equipment_by_id():
    db = Database()
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()

    user = flask_login.current_user

    equipment_id = request.args.get('equipment_id')
    sql_string = 'SELECT ID, equipment_owner_id, equipment_co_owner_id FROM equipment WHERE ID = "' + equipment_id + '"'
    c.execute(sql_string)

    equip = c.fetchall()[0]
    equipment_owner_id = equip['equipment_owner_id']
    equipment_co_owner_id = equip['equipment_co_owner_id']

    # admin is allowed to receive all the data
    if user.is_admin():
        sql_string = 'SELECT * FROM equipment WHERE ID = "' + equipment_id + '"'
        c.execute(sql_string)
        data = c.fetchall()
    # financial team is allowed to see all the insensitive data and financial data
    elif user.is_financial_team():
        sql_string = 'SELECT * FROM equipment WHERE ID = "' + equipment_id + '"'
        c.execute(sql_string)
        data = c.fetchall()
    # owner allowed to see all the data about the equipment
    elif user.is_owner() and user.get_id() == equipment_owner_id:
        sql_string = 'SELECT * FROM equipment WHERE ID = "' + equipment_id + '"'
        c.execute(sql_string)
        data = c.fetchall()
    # co-owner allowed to see all the data about the equipment
    elif user.is_owner() and user.get_id() == equipment_co_owner_id:
        sql_string = 'SELECT * FROM equipment WHERE ID = "' + equipment_id + '"'
        c.execute(sql_string)
        data = c.fetchall()
    # the rest is only allowed to see the insensitive data
    else:
        sql_string = 'SELECT ID, equipment_inventory_number, equipment_label, equipment_name, equipment_amount, ' \
                     'equipment_description, equipment_outcome, equipment_purchase_date, equipment_base_location, ' \
                     'equipment_is_mobile, equipment_owner_id, equipment_co_owner_id, equipment_supplier_id, ' \
                     'equipment_bookable FROM equipment WHERE ID = "' + equipment_id + '"'
        c.execute(sql_string)
        data = c.fetchall()

    c.close()
    return json.dumps(data)


@equipment.route('/equipment/update', methods=['GET'])
@login_required
def update_equipment():
    sql_string = 'UPDATE equipment SET '
    sql_parameters = ''
    ID = request.args.get('ID')

    db = Database()
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()

    user = flask_login.current_user

    equipment_id = request.args.get('ID')
    sql_equipment = 'SELECT ID, equipment_owner_id, equipment_co_owner_id FROM equipment WHERE ID = "' + equipment_id + '"'
    c.execute(sql_equipment)

    equip = c.fetchall()[0]
    equipment_owner_id = equip['equipment_owner_id']
    equipment_co_owner_id = equip['equipment_co_owner_id']

    # check if user is allowed to edit/update the equipment
    if not user.is_admin():
        if user.get_id() != equipment_owner_id and user.get_id() != equipment_co_owner_id:
            return 'http403'

    # sql_string gets prepared
    equipment_inventory_number = request.args.get('equipment_inventory_number')
    if equipment_inventory_number != '':
        sql_parameters = sql_parameters + 'equipment_inventory_number="' + equipment_inventory_number + '"'

    equipment_label = request.args.get('equipment_label')
    if equipment_label != '':
        sql_parameters = sql_parameters + ',equipment_label="' + equipment_label + '"'

    equipment_name = request.args.get('equipment_name').capitalize()
    if equipment_name != '':
        sql_parameters = sql_parameters + ',equipment_name="' + equipment_name + '"'
    else:
        return 'http400'

    equipment_amount = request.args.get('equipment_amount')
    if equipment_amount != '':
        sql_parameters = sql_parameters + ',equipment_amount="' + equipment_amount + '"'

    equipment_description = request.args.get('equipment_description')
    if equipment_description != '':
        sql_parameters = sql_parameters + ',equipment_description="' + equipment_description + '"'

    equipment_outcome = request.args.get('equipment_outcome')
    if equipment_outcome != '':
        sql_parameters = sql_parameters + ',equipment_outcome="' + equipment_outcome + '"'

    equipment_purchase_date = request.args.get('equipment_purchase_date')
    if equipment_purchase_date != '':
        sql_parameters = sql_parameters + ',equipment_purchase_date="' + equipment_purchase_date + '"'

    equipment_base_location = request.args.get('equipment_base_location')
    if equipment_base_location != '':
        sql_parameters = sql_parameters + ',equipment_base_location="' + equipment_base_location + '"'

    equipment_is_mobile = request.args.get('equipment_is_mobile')
    if equipment_is_mobile != '':
        sql_parameters = sql_parameters + ',equipment_is_mobile="' + equipment_is_mobile + '"'

    equipment_bookable = request.args.get('equipment_bookable')
    if equipment_bookable != '':
        sql_parameters = sql_parameters + ',equipment_bookable="' + equipment_bookable + '"'

    equipment_owner_id = request.args.get('equipment_owner_id')
    if equipment_owner_id != '':
        sql_parameters = sql_parameters + ',equipment_owner_id="' + equipment_owner_id + '"'

        sql_user_set_owner = 'UPDATE users SET user_is_owner= "1" WHERE ID = "' + equipment_owner_id + '"'
        c.execute(sql_user_set_owner)

    equipment_co_owner_id = request.args.get('equipment_co_owner_id')
    if equipment_co_owner_id != '':
        sql_parameters = sql_parameters + ',equipment_co_owner_id="' + equipment_co_owner_id + '"'

        sql_user_set_owner = 'UPDATE users SET user_is_owner= "1" WHERE ID = "' + equipment_co_owner_id + '"'
        c.execute(sql_user_set_owner)

    equipment_purchase_price = request.args.get('equipment_purchase_price')
    if equipment_purchase_price != '':
        sql_parameters = sql_parameters + ',equipment_purchase_price="' + equipment_purchase_price + '"'

    equipment_annual_cost = request.args.get('equipment_annual_cost')
    if equipment_annual_cost != '':
        sql_parameters = sql_parameters + ',equipment_annual_cost="' + equipment_annual_cost + '"'

    equipment_annual_cost_budget = request.args.get('equipment_annual_cost_budget')
    if equipment_annual_cost_budget != '':
        sql_parameters = sql_parameters + ',equipment_annual_cost_budget="' + equipment_annual_cost_budget + '"'

    equipment_supplier_id = request.args.get('equipment_supplier_id')
    if equipment_supplier_id != '':
        sql_parameters = sql_parameters + ',equipment_supplier_id="' + equipment_supplier_id + '"'

    if sql_parameters[0] == ',':
        sql_parameters = sql_parameters[1:]
    sql_string = sql_string + sql_parameters + ' WHERE ID = ' + ID

    # sql_string gets executed
    c.execute(sql_string)
    db.conn.commit()

    c.close()
    return 'http200'


@equipment.route('/equipment/new', methods=['GET'])
@login_required
def new_equipment():
    user = flask_login.current_user
    # only admin is allowed to create a new equipment
    if not user.is_admin():
        return 'http403'

    db = Database()
    c = db.conn.cursor()

    sql_string = 'INSERT INTO equipment '
    sql_parameters = '('
    sql_values = '('

    equipment_inventory_number = request.args.get('equipment_inventory_number')
    if equipment_inventory_number != '':
        sql_parameters = sql_parameters + 'equipment_inventory_number,'
        sql_values = sql_values + '"' + equipment_inventory_number + '",'

    equipment_label = request.args.get('equipment_label')
    if equipment_label != '':
        sql_parameters = sql_parameters + 'equipment_label,'
        sql_values = sql_values + '"' + equipment_label + '",'

    equipment_name = request.args.get('equipment_name')
    if equipment_name != '':
        sql_parameters = sql_parameters + 'equipment_name,'
        sql_values = sql_values + '"' + equipment_name + '",'
    else:
        return 'http400'

    equipment_amount = request.args.get('equipment_amount')
    if equipment_amount != '':
        sql_parameters = sql_parameters + 'equipment_amount,'
        sql_values = sql_values + '"' + equipment_amount + '",'

    equipment_description = request.args.get('equipment_description')
    if equipment_description != '':
        sql_parameters = sql_parameters + 'equipment_description,'
        sql_values = sql_values + '"' + equipment_description + '",'

    equipment_outcome = request.args.get('equipment_outcome')
    if equipment_outcome != '':
        sql_parameters = sql_parameters + 'equipment_outcome,'
        sql_values = sql_values + '"' + equipment_outcome + '",'

    equipment_purchase_date = request.args.get('equipment_purchase_date')
    if equipment_purchase_date != '':
        sql_parameters = sql_parameters + 'equipment_purchase_date,'
        sql_values = sql_values + '"' + equipment_purchase_date + '",'

    equipment_base_location = request.args.get('equipment_base_location')
    if equipment_base_location != '':
        sql_parameters = sql_parameters + 'equipment_base_location,'
        sql_values = sql_values + '"' + equipment_base_location + '",'

    equipment_is_mobile = request.args.get('equipment_is_mobile')
    if equipment_is_mobile != '':
        sql_parameters = sql_parameters + 'equipment_is_mobile,'
        sql_values = sql_values + '"' + equipment_is_mobile + '",'

    # equipment_bookable = request.args.get('equipment_bookable')
    # if equipment_bookable != '':
    #     sql_parameters = sql_parameters + 'equipment_bookable,'
    #     sql_values = sql_values + '"' + equipment_bookable + '",'

    equipment_owner_id = request.args.get('equipment_owner_id')
    if equipment_owner_id != '':
        sql_parameters = sql_parameters + 'equipment_owner_id,'
        sql_values = sql_values + '"' + equipment_owner_id + '",'

        sql_user_set_owner = 'UPDATE users SET user_is_owner= "1" WHERE ID = "' + equipment_owner_id + '"'
        c.execute(sql_user_set_owner)

    equipment_co_owner_id = request.args.get('equipment_co_owner_id')
    if equipment_co_owner_id != '':
        sql_parameters = sql_parameters + 'equipment_co_owner_id,'
        sql_values = sql_values + '"' + equipment_co_owner_id + '",'

        sql_user_set_owner = 'UPDATE users SET user_is_owner= "1" WHERE ID = "' + equipment_co_owner_id + '"'
        c.execute(sql_user_set_owner)

    equipment_purchase_price = request.args.get('equipment_purchase_price')
    if equipment_purchase_price != '':
        sql_parameters = sql_parameters + 'equipment_purchase_price,'
        sql_values = sql_values + '"' + equipment_purchase_price + '",'

    equipment_annual_cost = request.args.get('equipment_annual_cost')
    if equipment_annual_cost != '':
        sql_parameters = sql_parameters + 'equipment_annual_cost,'
        sql_values = sql_values + '"' + equipment_annual_cost + '",'

    equipment_annual_cost_budget = request.args.get('equipment_annual_cost_budget')
    if equipment_annual_cost_budget != '':
        sql_parameters = sql_parameters + 'equipment_annual_cost_budget,'
        sql_values = sql_values + '"' + equipment_annual_cost_budget + '",'

    equipment_supplier_id = request.args.get('equipment_supplier_id')
    if equipment_supplier_id != '':
        sql_parameters = sql_parameters + 'equipment_supplier_id,'
        sql_values = sql_values + '"' + equipment_supplier_id + '",'

    if sql_parameters[len(sql_parameters) - 1] == ',':
        sql_parameters = sql_parameters[:len(sql_parameters) - 1] + sql_parameters[(len(sql_parameters) - 1 + 1):]
    if sql_values[len(sql_values) - 1] == ',':
        sql_values = sql_values[:len(sql_values) - 1] + sql_values[(len(sql_values) - 1 + 1):]

    sql_string = sql_string + sql_parameters + ') VALUES ' + sql_values + ')'

    c.execute(sql_string)
    db.conn.commit()

    c.close()
    return 'http200'


@equipment.route('/equipment/delete', methods=['GET'])
@login_required
def delete_equipment():
    user = flask_login.current_user
    # only admin is allowed to delete a new equipment
    if not user.is_admin():
        return 'http403'

    db = Database()
    ID = request.args.get('ID')

    sql1 = 'DELETE FROM equipment WHERE ID = "' + ID + '"'
    sql2 = 'DELETE FROM pictures WHERE equipment_id = "' + ID + '"'
    sql3 = 'DELETE FROM documents WHERE equipment_id = "' + ID + '"'

    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()
    c.execute(sql1)
    c.execute(sql2)
    c.execute(sql3)
    db.conn.commit()

    pictures_dir = os.path.join(os.getcwd(), 'static\\images\\upload\\')
    for filename in os.listdir(pictures_dir):
        if filename.startswith("equipment_picture_id_" + ID):
            os.remove(os.path.join(pictures_dir, filename))

    documents_dir = os.path.join(os.getcwd(), 'static\\docs\\upload\\')
    for filename in os.listdir(documents_dir):
        if filename.startswith("equipment_document_id_" + ID):
            os.remove(os.path.join(documents_dir, filename))

    c.close()
    return 'http200'


@equipment.route('/equipment/download-as-csv')
@login_required
def download_equipment_as_csv():
    db = Database()
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()
    sql_string = 'SELECT * FROM equipment'
    c.execute(sql_string)
    data = c.fetchall()
    c.close()

    data_file = open('data_equipment.csv', 'w', encoding="utf-8", newline='')
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

    with open("data_equipment.csv") as fp:
        csv_file = fp.read()

    user = flask_login.current_user

    # admin is allowed to receive all the data
    if user.is_admin():
        return Response(csv_file, mimetype="text/csv",
                        headers={"Content-disposition": "attachment; filename=data_equipment.csv"})
    else:
        return redirect(request.referrer)
