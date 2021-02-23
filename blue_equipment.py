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

