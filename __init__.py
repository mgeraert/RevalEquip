from flask import Flask, render_template
from classes.Database import Database

import sys
import glob
import json
import platform
import os

from blue_suppliers import suppliers
from blue_users import users
from blue_equipment import equipment

app = Flask(__name__)
app.register_blueprint(suppliers)
app.register_blueprint(users)
app.register_blueprint(equipment)

db = Database()
db.create_db()

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

if __name__ == '__main__':
    #app.run(debug=True, use_reloader=True)
    app.run( host="0.0.0.0", port="5000")
