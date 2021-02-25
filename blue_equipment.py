from flask import Blueprint, request, render_template
from classes.Database import Database
import json

equipment = Blueprint('equipment', __name__)


@equipment.route('/Equipment', methods=['GET'])
def reval_equipment():
    return render_template('equipment.html')


@equipment.route('/GetEquipment', methods=['GET'])
def get_equipment():
    db = Database()
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()
    sql_string = 'SELECT * FROM equipment'
    c.execute(sql_string)
    data = c.fetchall()
    return json.dumps(data)

@equipment.route('/UpdateEquipment', methods=['GET'])
def update_equipment():
    ID = request.args.get('ID')
    equipment_inventory_number = request.args.get('equipment_inventory_number')
    equipment_label = request.args.get('equipment_label')
    equipment_name = request.args.get('equipment_name')
    equipment_amount = request.args.get('equipment_amount')
    equipment_description = request.args.get('equipment_description')
    equipment_outcome = request.args.get('equipment_outcome')
    equipment_purchase_date = request.args.get('equipment_purchase_date')
    equipment_base_location = request.args.get('equipment_base_location')
    equipment_owner_id = request.args.get('equipment_owner_id')
    equipment_co_owner_id = request.args.get('equipment_co_owner_id')
    equipment_purchase_price = request.args.get('equipment_purchase_price')
    equipment_annual_cost = request.args.get('equipment_annual_cost')
    equipment_annual_cost_budget = request.args.get('equipment_annual_cost_budget')
    db = Database()
    sql_string = 'UPDATE equipment SET equipment_inventory_number="' + equipment_inventory_number + '", equipment_label="' + equipment_label + '" , equipment_name="' + equipment_name + '" , equipment_amount="' + equipment_amount + '" , equipment_description="' + equipment_description + '" , equipment_outcome="' + equipment_outcome + '" , equipment_purchase_date="' + equipment_purchase_date + '" , equipment_base_location="' + equipment_base_location + '" , equipment_owner_id="' + equipment_owner_id + '" , equipment_co_owner_id="' + equipment_co_owner_id + '" , equipment_purchase_price="' + equipment_purchase_price + '" , equipment_annual_cost="' + equipment_annual_cost + '" , equipment_annual_cost_budget="' + equipment_annual_cost_budget + '" WHERE ID = ' + ID
    print(sql_string)
    c = db.conn.cursor()
    c.execute(sql_string)
    db.conn.commit()
    return 'http200'
