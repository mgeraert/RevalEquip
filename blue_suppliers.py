import csv

from flask import Blueprint, request, render_template, Response
from flask_login import login_required

from classes.Database import Database
import json

suppliers = Blueprint('suppliers', __name__)


@suppliers.route('/suppliers', methods=['GET'])
@login_required
def reval_suppliers():
    return render_template('suppliers.html')

@suppliers.route('/getSuppliers', methods=['GET'])
def get_users():
    db = Database()
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()
    sql_string = 'SELECT * FROM suppliers'
    c.execute(sql_string)
    data = c.fetchall()

    c.close()
    return json.dumps(data)

@suppliers.route('/updateSupplier', methods=['GET'])
def update_user():
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

    supplier_phone = request.args.get('supplier_phone')
    if supplier_phone != '':
        sql_parameters = sql_parameters + ',supplier_phone="' + supplier_phone + '"'

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

@suppliers.route('/newSupplier', methods=['GET'])
def new_user():
    sql_string = 'INSERT INTO suppliers '
    sql_parameters = '('
    sql_values = '('

    supplier_last_name = request.args.get('supplier_last_name')
    if supplier_last_name != '':
        sql_parameters = sql_parameters + 'supplier_last_name,'
        sql_values = sql_values + '"' + supplier_last_name + '",'
    else:
        return 'http400'

    supplier_name = request.args.get('supplier_name')
    if supplier_name != '':
        sql_parameters = sql_parameters + 'supplier_name,'
        sql_values = sql_values + '"' + supplier_name + '",'
    else:
        return 'http400'

    supplier_email = request.args.get('supplier_email')
    if supplier_email != '':
        sql_parameters = sql_parameters + 'supplier_email,'
        sql_values = sql_values + '"' + supplier_email + '",'

    supplier_phone = request.args.get('supplier_phone')
    if supplier_phone != '':
        sql_parameters = sql_parameters + 'supplier_phone,'
        sql_values = sql_values + '"' + supplier_phone + '",'

    supplier_company = request.args.get('supplier_company')
    if supplier_company != '':
        sql_parameters = sql_parameters + 'supplier_company,'
        sql_values = sql_values + '"' + supplier_company + '",'

    supplier_comment = request.args.get('supplier_comment')
    if supplier_comment != '':
        sql_parameters = sql_parameters + 'supplier_comment,'
        sql_values = sql_values + '"' + supplier_comment + '",'

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

@suppliers.route('/deleteSupplier', methods=['GET'])
def delete_user():
    db = Database()
    ID = request.args.get('ID')

    sql = 'DELETE FROM suppliers WHERE ID = "'+ID+'"'
    print(sql)
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()
    c.execute(sql)
    db.conn.commit()

    c.close()
    return 'http200'

@suppliers.route('/saveSuppliersAsCSV')
def save_equipment_as_csv():
    db = Database()
    db.conn.row_factory = db.dict_factory
    c = db.conn.cursor()
    sql_string = 'SELECT * FROM suppliers'
    c.execute(sql_string)
    data = c.fetchall()
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

    return 'http200'

@suppliers.route('/downloadSuppliersCSV')
def download_suppliers_csv():
    save_equipment_as_csv()

    with open("data_suppliers.csv") as fp:
        csv = fp.read()
    return Response(csv,mimetype="text/csv",headers={"Content-disposition":"attachment; filename=data_suppliers.csv"})