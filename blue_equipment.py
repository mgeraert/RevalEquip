from flask import Blueprint, request, render_template
from classes.Database import Database
import json

equipment = Blueprint('equipment', __name__)


@equipment.route('/equipment', methods=['GET'])
def reval_equipment():
    return render_template('equipment.html')


@equipment.route('/getEquipment', methods=['GET'])
def get_equipment():
    db = Database()
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()
    sql_string = 'SELECT * FROM equipment'
    c.execute(sql_string)
    data = c.fetchall()

    c.close()
    return json.dumps(data)

@equipment.route('/newEquipment', methods=['GET'])
def new_equipment():
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

    equipment_owner_id = request.args.get('equipment_owner_id')
    if equipment_owner_id != '':
        sql_parameters = sql_parameters + 'equipment_owner_id,'
        sql_values = sql_values + '"' + equipment_owner_id + '",'

    equipment_co_owner_id = request.args.get('equipment_co_owner_id')
    if equipment_co_owner_id != '':
        sql_parameters = sql_parameters + 'equipment_co_owner_id,'
        sql_values = sql_values + '"' + equipment_co_owner_id + '",'

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

@equipment.route('/updateEquipment', methods=['GET'])
def update_equipment():
    sql_string = 'UPDATE equipment SET '
    sql_parameters = ''
    ID = request.args.get('ID')

    equipment_inventory_number = request.args.get('equipment_inventory_number')
    if equipment_inventory_number != '':
        sql_parameters = sql_parameters + 'equipment_inventory_number="' + equipment_inventory_number + '"'

    equipment_label = request.args.get('equipment_label')
    if equipment_label != '':
        sql_parameters = sql_parameters + ',equipment_label="' + equipment_label + '"'

    equipment_name = request.args.get('equipment_name')
    if equipment_name != '':
        sql_parameters = sql_parameters + ',equipment_name="' + equipment_name + '"'

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

    equipment_owner_id = request.args.get('equipment_owner_id')
    if equipment_owner_id != '':
        sql_parameters = sql_parameters + ',equipment_owner_id="' + equipment_owner_id + '"'

    equipment_co_owner_id = request.args.get('equipment_co_owner_id')
    if equipment_co_owner_id != '':
        sql_parameters = sql_parameters + ',equipment_co_owner_id="' + equipment_co_owner_id + '"'

    equipment_purchase_price = request.args.get('equipment_purchase_price')
    if equipment_purchase_price != '':
        sql_parameters = sql_parameters + ',equipment_purchase_price="' + equipment_purchase_price + '"'

    equipment_annual_cost = request.args.get('equipment_annual_cost')
    if equipment_annual_cost != '':
        sql_parameters = sql_parameters + ',equipment_annual_cost="' + equipment_annual_cost + '"'

    equipment_annual_cost_budget = request.args.get('equipment_annual_cost_budget')
    if equipment_annual_cost_budget != '':
        sql_parameters = sql_parameters + ',equipment_annual_cost_budget="' + equipment_annual_cost_budget + '"'

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

@equipment.route('/deleteEquipment', methods=['GET'])
def delete_equipment():
    db = Database()
    ID = request.args.get('ID')

    sql = 'DELETE FROM equipment WHERE ID = "'+ID+'"'
    print(sql)
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()
    c.execute(sql)
    db.conn.commit()

    c.close()
    return 'http200'


@equipment.route('/updateSuggestion', methods=['GET'])
def update_suggestion():
    owner_name = request.args.get('owner_name')
    db = Database()

    sql_string_last_name = 'SELECT ID, user_last_name, user_name FROM users WHERE user_last_name LIKE "%'+owner_name+'%"'
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()
    c.execute(sql_string_last_name)
    data_last_name = c.fetchall()

    sql_string_first_name = 'SELECT ID, user_last_name, user_name FROM users WHERE user_name LIKE "%'+owner_name+'%"'
    c.execute(sql_string_first_name)
    data_first_name = c.fetchall()
    print(data_first_name)

    list_of_all_names = data_first_name+data_last_name
    print(list_of_all_names)

    c.close()
    return json.dumps(list_of_all_names)

@equipment.route('/getUserByID', methods=['GET'])
def get_user_by_id():
    db = Database()
    user_id = request.args.get('ID')

    sql = 'SELECT * FROM users WHERE ID = "'+user_id+'"'
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()
    c.execute(sql)
    return json.dumps(c.fetchall())

@equipment.route('/getUserIDByUserName', methods=['GET'])
def get_user_id_by_user_name():
    db = Database()
    user_last_name = request.args.get('user_last_name')
    user_name = request.args.get('user_name')

    sql = 'SELECT * FROM users WHERE user_name LIKE "%' + user_name + '%" AND user_last_name LIKE "%' + user_last_name + '%"'
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()
    c.execute(sql)
    return json.dumps(c.fetchall())