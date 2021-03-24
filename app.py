from flask import Flask, render_template
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from logging import Formatter, FileHandler

from user import User

import os

from blue_equipment import equipment
from blue_users import users
from blue_suppliers import suppliers
from blue_auth import auth
from blue_files import files

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///revalEquip.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['ALLOWED_EXTENSIONS'] = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
app.config['SECRET_KEY'] = 'wwzzxxsecretekeytodatabase'

app.register_blueprint(equipment)
app.register_blueprint(users)
app.register_blueprint(suppliers)
app.register_blueprint(auth)
app.register_blueprint(files)

# -------------------------------------------------------------------------------

# basedir = os.path.abspath(os.path.dirname(__file__))
#
# handler = FileHandler(os.path.join(basedir, 'log.txt'), encoding='utf8')
# handler.setFormatter(
#     Formatter("[%(asctime)s] %(levelname)-8s %(message)s", "%Y-%m-%d %H:%M:%S")
# )
# app.logger.addHandler(handler)

db = SQLAlchemy(app)

# -------------------------------------------------------------------------------

login_manager = LoginManager()
login_manager.login_view = 'auth.login'
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    # return User.query.get(int(user_id))
    print(User.query.filter_by(id=user_id))
    return User.query.filter_by(id=user_id).first()

@app.route("/hello")
def beneden():
    return 'Hi'


@app.route("/test")
def test():
    return render_template('test.html')


@app.route("/menu")
def menu():
    return render_template('menu.html')


if __name__ == '__main__':
    # app.run(debug=True, use_reloader=True)
    app.run(host="0.0.0.0", port=5000)
