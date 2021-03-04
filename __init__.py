from flask import Flask, Flask, request, render_template, send_from_directory, url_for, jsonify
from classes.Database import Database
from werkzeug.utils import secure_filename

import sys
import glob
import json
import platform
import os

basedir = os.path.abspath(os.path.dirname(__file__))

from blue_suppliers import suppliers
from blue_users import users
from blue_equipment import equipment

app = Flask(__name__)
app.register_blueprint(suppliers)
app.register_blueprint(users)
app.register_blueprint(equipment)

db = Database()
db.create_db()

from logging import Formatter, FileHandler
handler = FileHandler(os.path.join(basedir, 'log.txt'), encoding='utf8')
handler.setFormatter(
    Formatter("[%(asctime)s] %(levelname)-8s %(message)s", "%Y-%m-%d %H:%M:%S")
)
app.logger.addHandler(handler)

app.config['ALLOWED_EXTENSIONS'] = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}


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

@app.route('/uploadajax_eq', methods=['GET','POST'])
def upldfile_eq():
    equipment_id = request.args.get('equipment_id')
    if request.method == 'POST':
        files = request.files['file']
        if files and allowed_file(files.filename):
            filename = equipment_id+'-1'+secure_filename(files.filename)
            app.logger.info('FileName: ' + filename)
            updir = os.path.join(basedir, 'static\\images\\upload\\')
            files.save(os.path.join(updir, filename))
            file_size = os.path.getsize(os.path.join(updir, filename))
            return jsonify(name=filename, size=file_size)

if __name__ == '__main__':
    #app.run(debug=True, use_reloader=True)
    app.run( host="0.0.0.0", port="5000")
